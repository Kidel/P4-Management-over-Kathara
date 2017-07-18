var express = require('express');
var router = express.Router();
var http = require("http");

var man_network = 'localhost';

var options = {
    host: man_network,
    port: 3001,
    path: '/',
    method: 'GET',
    headers: {
        'Content-Type': 'application/json'
    }
  }

var ips = [];

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
})
.get('/detect', function(req, res, next) {
  console.log('dentro get detect');

  var get_req = http.request(options, function(res)
    {
        var output = '';
        console.log(options.host + ':' + res.statusCode);
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
          console.log(chunk);
            output += chunk;
        });
/*
        res.on('end', function() {
            var obj = JSON.parse(output);
            onResult(res.statusCode, obj);
        });*/

        if (res.statusCode < 300){
          ips.push(options.host);
        }
    });

    get_req.on('error', function(err) {
      console.log(err.message);
        //res.send('error: ' + err.message);
    });

    get_req.end();



    res.render('index', { title: 'Express' });
});

module.exports = router;
