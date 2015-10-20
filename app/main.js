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
// Get lodge
app.get('/api/lodges/:lodgenr', function (req, res) {
    var lodgenr = req.params.lodgenr;
    var data;
    db.query("SELECT * FROM Lodges WHERE lodgenr="+lodgenr,
        function(success, result){
            if (success){
                data = result;

                var q = 'SELECT startweek, endweek FROM Orders WHERE lodgenr='+lodgenr;
                db.query(q, function(success, datesresult){
                    if (success)
                        data["orderdates"] = datesresult;
                    res.end(JSON.stringify(data));
                });
            }
    });
})

// Get all lodges
app.get('/api/lodges/', function (req, res) {
    var data;
    db.query("SELECT * FROM Lodges",
        function(success, result){
            if (success){
                data = result;
            }
            console.log(data);
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
    var q = 'SELECT nr, email, firstName, lastName FROM Accounts WHERE email="'+email+'"';
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
// Rent lodge
app.post('/api/lodge/rent/', function (req, res) {
    var data = req.body
    console.log("Renting lodge "+data.lodgenr);
    // Create transaction
    var transactionname = "LodgeRent-"+data.lodgenr;
    var q = "START TRANSACTION";
    db.query(q, function(){});
    console.log(q);
    // Insert
    data.price = data.price * (parseInt(data.weekend)-parseInt(data.weekstart)+1);
    console.log(data);
    var q = 'INSERT INTO Orders (lodgenr,email,price,startweek,endweek) '+
        'VALUES ('+data.lodgenr+',"'+data.email+'",'+data.price+','+
        data.weekstart+','+data.weekend+')';
    console.log(q);

    db.query(q, function(result, message){
        var response = {};
        console.log(message);
        if (result){
            db.query("COMMIT", function(){});
            response.success = true;
            response.message = "Rent was successful";
        }
        else {
            db.query("ROLLBACK", function(){});
            response.success = false;
            response.message = "500: Couldn't create order";
        }
        res.send(response);
    });
})
// Get users orders
app.get('/api/users/:email/orders', function(req, res) {
    var email = req.params.email;
    var q = 'SELECT * FROM Orders INNER JOIN Lodges ON Lodges.lodgenr=Orders.lodgenr WHERE email="'+email+'"';
    console.log(q);
    db.query(q, function(result, message){
        console.log(message)
        res.end(JSON.stringify(message));
    });
});
// Get specific order
app.get('/api/orders/:ordernr/', function(req, res) {
    var ordernr = req.params.ordernr;
    var q = 'SELECT * FROM Orders INNER JOIN Lodges ON Lodges.lodgenr=Orders.lodgenr WHERE ordernr="'+ordernr+'"';
    console.log(q);
    db.query(q, function(result, message){
        console.log(message)
        var equipmenttype;
        if (message.startweek < 10 || message.startweek > 40){
            equipmenttype = "WinterRentals"
            q = 'SELECT * FROM WinterRentals WHERE ordernr='+message.ordernr;
        }
        else {
            equipmenttype = "SummerRentals"
            q = 'SELECT * FROM SummerRentals WHERE ordernr='+message.ordernr;
        }
        console.log(q);
        db.query(q, function(result, message2){
            console.log(message2)
            if (message2 && "ordernr" in message2){
                var tmp = message2
                message2 = {"1":tmp};
            }
            message[equipmenttype] = message2;
            var q = "SELECT * FROM Customers WHERE Customers.ordernr="+ordernr;
            db.query(q, function(result, message3){
                if (result){
                    message['customers'] = message3;
                    res.end(JSON.stringify(message));
                }
            })
        });
    });
});
app.post('/api/orders/add_customer', function(req, res){
    var data = req.body;
    var q = 'INSERT INTO Customers (name,gender,ordernr) VALUES ("' +
            data.name + '","' + data.gender + '",' + data.ordernr + ')';
    console.log(q);
    db.query(q, function(result, message){
        if (result){
            console.log(message);
            res.send("Successfully added customer");
        }
        else {
            console.log(message);
        }
    });
});
// Rent skis
app.post('/api/rent/skis', function(req, res){
    var data = req.body;
    // Increase price
    console.log(data);
    var q = 'INSERT INTO WinterRentals '+
            '(ordernr,startweek,endweek,skitype,skilength,skishoesize,skipolelength,skihelmetsize) VALUES ('+
        +data.ordernr+','+data.startweek+','+data.endweek+',"'+
        data.skitype+'",'+data.skilength+','+data.skishoesize+','+data.skipolelength+',"'+data.helmetsize+'")';
    console.log(q);
    db.query(q, function(result, message){
        console.log(message);
        if (result)
            res.send("hello skirental, it worked!");
    });
})
// Rent bike
app.post('/api/rent/bike', function(req, res){
    var data = req.body;
    // Increase price
    console.log(data);
    var q = 'INSERT INTO SummerRentals (ordernr,startweek,endweek,biketype,leglength,bikehelmetsize) VALUES ('+
        +data.ordernr+','+data.startweek+','+data.endweek+',"'+
        data.biketype+'",'+data.leglength+',"'+data.helmetsize+'")';
    console.log(q);
    db.query(q, function(result, message){
        console.log(message);
        if (result)
            res.send("hello bikerental, it worked!");
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
