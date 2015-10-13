#!/bin/node

// Load modules
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var fs = require('fs');

// Setup database
var db = require('./db.js');
db.connect();

// Prepare express for POST
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Add static file folders
app.use('/css', express.static('css'));
app.use('/js', express.static('js'));
app.use('/templates', express.static('templates'));

/*
    Setup API
*/
// Get lodges
app.get('/api/lodges/', function (req, res) {
    //var data = {"lodge1": {"nr": 1, "bedc": 2}};
    var data;
    db.query("SELECT * FROM Lodges",
        function(success, result){
            if (success){
                data = result;
            }
            res.end(JSON.stringify(data));
    });
})
// Get users
app.get('/api/users/', function (req, res) {
    var data = {"user1": {"nr": 1, "pass": "testpass"}};
    res.end(JSON.stringify(data));
})
app.get('/api/users/:email', function(req, res) {
    var email = req.params.email;
    var q = 'SELECT email, firstName, lastName FROM Accounts WHERE email="'+email+'"';
    db.query(q, function(result, message){
        console.log(message)
        res.end(JSON.stringify(message));
    });
  });
// Register user
app.post('/api/users/', function (req, res) {
    var user = req.body
    console.log("Creating user "+user);

    var q = 'INSERT INTO Accounts VALUES ("'+
        user["email"] + '","' + user["password"] + '","' +
        user["firstName"] + '","' + user["lastName"] + '")';
    console.log(q);
    db.query(q,function(result){
        var response = {};
        if (result){
            response.success = true;
            response.message = "User created successfully";
        }
        else {
            response.success = false;
            response.message = "500: Couldn't create account";
        }
        res.send(response);
    });
})
// Authenticate login
app.post('/api/authenticate/', function (req, res) {
    var email = req.body.email;

    var q = 'SELECT * FROM Accounts WHERE email="' + email + '"';
    console.log(q);
    db.query(q, function(result, message){
        console.log(message);
        var response = {};
        if (!result){
            response.success = false;
            response.message = "Invalid email address";
        }
        else if (req.body.password != message.password){
            response.success = false;
            response.message = "Invalid password";
        }
        else {
            response.success = true;
            response.user = message;
        }
        res.send(response);
    })
})

// Setup homepage
app.get('/*/', function (req, res) {
   fs.readFile( __dirname + "/" + "index.html", 'utf8', function (err, data) {
       res.end( data );
   });
})

// Start http serving
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("Example app listening at http://%s:%s", host, port)
})
