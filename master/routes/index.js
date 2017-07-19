var express = require('express');
var router = express.Router();
var http = require("http");
var fs = require('fs');
var querystring = require('querystring');

var man_network = [];
for(var i=2; i < 255; i++) 
  man_network.push('10.0.0.'+i);

var subscribers = [];

var showIndex = function(req, res, next) {
  res.render('index', { title: 'P4 Management - Master' });
}

var detect = function(req, res, next) {
  console.log('dentro get detect');

  /*Reset subscribers.txt and send get requests*/
  subscribers = [];
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
      var get_req = http.request(options, function(response){
          console.log(options.host + ':' + response.statusCode);
          response.setEncoding('utf8');

          if (response.statusCode < 300){
            subscribers.push(options.host);
            fs.appendFile('subscribers.txt', options.host + '\n', function (err) {
              if (err) throw err;
              console.log('Saved!');
            });
            //console.log(subscribers);
            // emit to socket.io clients
            res.io.emit("socketToMe", options.host);
          }
      });

      get_req.on('error', function(err) {
        console.log(err.message);
      });

      get_req.end();
    });
  });

  res.json({ status: "OK" });
}

var subscribe = function(req, res, next) {
  ip = req.connection.remoteAddress;
  subscribers.push(ip);
  fs.appendFile('subscribers.txt', ip + '\n', function (err) {
              if (err) throw err;
              console.log('Saved!');
  });
  res.json({status: "OK"});
}

var showUpdateForm = function(req, res, next) {
  res.render('update', { title: 'Update subscribers', subscribers: subscribers });
}

var update = function(req, res, next) {
  fs.readFile('subscribers.txt', function (err, data) {
    subscribers = data.toString().split("\n");
    console.log(subscribers);
    subscribers.forEach(function(ip) {
      var data = querystring.stringify({
          p4: req.body.p4,
          p4Name: req.body.p4Name,
          cpu: req.body.cpu,
          cpuName: req.body.cpuName
        });

      var options = {
          host: ip,
          port: 3001,
          path: '/update',
          method: 'POST',
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'Content-Length': Buffer.byteLength(data)
          }
      };

      var post_req = http.request(options, function(res) {
          res.setEncoding('utf8');
          res.on('data', function (chunk) {
              console.log("body: " + chunk);
          });
      });

      post_req.on('error', function(err) {
            console.log(err.message);
      });

      post_req.write(data);
      post_req.end();
    });
    if(subscribers.length > 0)
      res.json({status: "OK"});
    else 
      res.json({status: "NOSUBS"});
  });
}

router.get('/', showIndex)
      .get('/detect', detect)
      .get('/subscribe', subscribe)
      .get('/update', showUpdateForm)
      .post('/update', update);

module.exports = router;
