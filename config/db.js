let mysql = require('mysql')

let connection = mysql.createConnection({
    host:       'localhost',
    user:       'root',
    password:   '',
    database:   'bookap'
});

connection.connect(function(error) {
    if(!!error){
        console.log(error);
    } else {
        console.log('Connection Successfully!');
    }
})

module.exports = connection;