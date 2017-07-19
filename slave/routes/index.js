var express = require('express');
var router = express.Router();
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;

var debug = true;
var p4_pid = -1;

var update = function(req, res, next){
  if (debug) console.log(req.body);

  fs.writeFile(req.body.p4Name, req.body.p4, function (err) {
    if (err) console.log(err.message);
    else console.log('Saved p4 program in ' + req.body.p4Name);

    fs.writeFile(req.body.cpuName, req.body.cpu, function (err) {
      if (err) console.log(err.message);
      else console.log('Saved p4 program in ' + req.body.cpuName);

      var json_name = req.body.p4Name.replace('.p4', '.json');

      /*comandi*/
      var child;
      fs.readFile('pid.txt', function (err, data) {
        if (err && typeof data != "undefined" && data.toString() != "") p4_pid = -1;
        else p4_pid = data.toString();
        console.log("BM PID: " + p4_pid);
        var command1 = (p4_pid == -1 || p4_pid.length < 1)? "cd /p4c-bm" : "kill " + p4_pid + " && cd /p4c-bm";
        child = exec(command1, function (error, stdout, stderr) {
          console.log('stdout: ' + stdout);
          console.log('stderr: ' + stderr);
          if (error !== null) {
            console.log('exec error: ' + error);
          }
          var compile;
          compile = exec("p4c-bmv2 --json /P4-Management-over-Netkit/slave/" + json_name + " /P4-Management-over-Netkit/slave/  </dev/null &>/dev/null &" + req.body.p4Name, function (error, stdout, stderr) {
            console.log('stdout: ' + stdout);
            console.log('stderr: ' + stderr);
            if (error !== null) {
              console.log('exec error: ' + error);
            }
            var changedir;
            changedir = exec("cd /PI", function (error, stdout, stderr) {
              console.log('stdout: ' + stdout);
              console.log('stderr: ' + stderr);
              if (error !== null) {
                console.log('exec error: ' + error);
              }
              var startp4
              startp4 = exec("simple_switch -i 0@eth1 -i 1@eth2 /P4-Management-over-Netkit/slave/" + json_name + " </dev/null &>/dev/null &", function (error, stdout, stderr) {
                console.log('stdout: ' + stdout);
                fs.writeFile('pid.txt', stdout, function (err) {
                    if (err) console.log(err.message);
                    else console.log('Saved PID!');
                });
                console.log('stderr: ' + stderr);
                if (error !== null) {
                  console.log('exec error: ' + error);
                }
              });
            });
          });
        });
      });
    });
  });
};

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
.post('/update', update);

module.exports = router;
