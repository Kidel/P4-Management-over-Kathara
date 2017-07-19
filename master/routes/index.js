var express = require('express');
var router = express.Router();
var http = require("http");
var fs = require('fs');

var man_network = ['localhost', 'wrong'];
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
  res.render('update', { title: 'Update subscribers' });
}

var update = function(req, res, next) {
  res.json({status: "WIP"});
}

router.get('/', showIndex)
      .get('/detect', detect)
      .get('/subscribe', subscribe)
      .get('/update', showUpdateForm)
      .post('/update', update);

module.exports = router;
