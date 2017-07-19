var express = require('express');
var router = express.Router();
var fs = require('fs');
var sys = require('sys')
var exec = require('child_process').exec;

var debug = true;

var update = function(req, res, next){
  if (debug) console.log(req.body);

  fs.writeFile(req.body.p4Name, req.body.p4, function (err) {
    if (err) console.log(err.message);
    else console.log('Saved p4 program in ' + req.body.p4Name);

    fs.writeFile(req.body.cpuName, req.body.cpu, function (err) {
      if (err) console.log(err.message);
      else console.log('Saved p4 program in ' + req.body.p4Name);

      /*comandi*/
      var child;
      child = exec("copy " + req.body.p4Name + " pippo.txt", function (error, stdout, stderr) {
        sys.print('stdout: ' + stdout);
        sys.print('stderr: ' + stderr);
        if (error !== null) {
          console.log('exec error: ' + error);
        }
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
