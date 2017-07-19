var express = require('express');
var router = express.Router();
var fs = require('fs');
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
      fs.readFile('pid.txt', function (err, data) {
        if (err && typeof data != "undefined" && data.toString() != "") p4_pid = -1;
        else {
          p4_pid = data.toString().split("\n");
          p4_pid = p4_pid[p4_pid.length - 1];
        }
        console.log("BM PID: " + p4_pid);
        var command1 = (p4_pid == -1 || p4_pid.length < 1)? "cd /p4c-bm" : "kill " + p4_pid + " && cd /p4c-bm";
        var child = exec(
            command1 + " && p4c-bmv2 --json /P4-Management-over-Netkit/slave/" + json_name + " /P4-Management-over-Netkit/slave/" + req.body.p4Name 
            + " && cd /PI && simple_switch -i 0@eth1 -i 1@eth2 /P4-Management-over-Netkit/slave/" + json_name + " &"
            , function (error, stdout, stderr) {
                console.log('stdout2: ' + stdout);
                console.log('stderr2: ' + stderr);
                if (error !== null) {
                  console.log('exec error: ' + error);
                }
                var getpid;
                getpid = exec("ps axf | grep simple_switch | grep -v grep | awk '{print $1}'", function (error, stdout, stderr) {
                  console.log('stdout5: ' + stdout);
                  console.log('stderr5: ' + stderr);
                  fs.writeFile('pid.txt', stdout, function (err) {
                      if (err) console.log(err.message);
                      else console.log('Saved PID!');
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
