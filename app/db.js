module.exports = {
    connect: connect,
    disconnect: disconnect,
    query: query,
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

function query(q, callback){
    connection.query(q, function(err, rows, fields){
        if (err){
            console.error(err);
            callback(false);
        }
        else {
            var result;
            if (rows.length == 0)
                result = "";
            else if (rows.length == 1)
                result = rows[0];
            else if (rows.length > 1) {
                var pk = fields[0].name
                result = {};
                for (row in rows){
                    result[rows[row][pk]] = rows[row];
                }
            }
            else {
                result = null;
            }
            //console.log(result);
            callback(true, result);
        }
    });
}
