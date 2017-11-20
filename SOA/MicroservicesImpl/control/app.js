var express = require('express');
var app = express();
var http = require('http');

var bodyParser = require('body-parser');
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.get('/control/', function(req, res){
  res.send('Hello Za Warudo');
});

app.post('/control/users', function(req,res){
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;

  if(username && email && password && username.length > 0 && email.length>0 && password.length>0)
     sendRequestToBD(req.body);
  else
     res.json({"status":"error","message":"Please fill all fields"});  
});

function sendRequestToBD(data,res){
var options = {
    host: 'localhost',
    port: 5001,
    path: '/bd/users',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(data)
    }
  };

  var httpreq = http.request(options, function (response) {
    response.setEncoding('utf8');
    response.on('data', function (chunk) {
      console.log("body: " + chunk);
      if(chunk.status == "ok")
        res.json({"status":"ok","message":"User has been registered with success"});
      else
        res.json({"status":"error", "message":"Registration failed, a user with the same email is already registered"});
    });
    response.on('end', function() {
     //quando que isso é chamado? :| no fim da req?
    })
  });
  httpreq.write(data);
  httpreq.end();
}

var server = app.listen(3000, function(){
  console.log('listening on port 3000')
});
