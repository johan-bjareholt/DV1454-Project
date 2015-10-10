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

// Setup homepage
app.get('/', function (req, res) {
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
