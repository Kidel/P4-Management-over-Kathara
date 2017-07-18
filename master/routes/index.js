var express = require('express');
var router = express.Router();
var http = require("http");
var fs = require('fs');

var man_network = ['localhost', 'wrong'];

var ips = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
.get('/detect', function(req, res, next) {
  console.log('dentro get detect');

  /*Reset subscribers.txt and send get requests*/
  fs.writeFile('subscribers.txt', '', function(){
    console.log('subscribers reset');
    man_network.forEach(function(ip) {
      var options = {
        host: ip,
        port: 3001,
        path: '/',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
      }

      var get_req = http.request(options, function(res)
      {
          console.log(options.host + ':' + res.statusCode);
          res.setEncoding('utf8');

          if (res.statusCode < 300){
            ips.push(options.host);
            fs.appendFile('subscribers.txt', options.host + '\n', function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
            console.log(ips);
          }
      });

      get_req.on('error', function(err) {
        console.log(err.message);
          //res.send('error: ' + err.message);
      });

      get_req.end();
    });
  });

    res.render('index', { title: 'Express' });
})
.get('/subscribe', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
.get('/update', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
