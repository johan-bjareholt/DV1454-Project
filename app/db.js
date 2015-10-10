module.exports = {
    connect: connect,
    disconnect: disconnect
};

mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'DBProjectUser',
    password : 'xyz321456xyz',
    database : 'DBProject'
});

function connect(){
    connection.connect(function(err){
        if (err){
            console.log("Couldn't connect to MySQL server")
        }
        else {
            console.log("Successfully connected to MySQL server")
        }
    });
}

function disconnect(){
    connection.end();
}

function query(){
    connection.query('SELECT 1 + 1 AS solution', function(err, rows, fields) {
        if (err) throw err;
        console.log('The solution is: ', rows[0].solution);
    });
}
