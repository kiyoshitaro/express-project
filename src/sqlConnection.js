const mysql = require("mysql");

const db_connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1998',
    database: 'nodelogin',
    port: '3306',
});
db_connection.connect((err) => {
    if (err) {
        console.log("Database Connection Failed", err);
    } else {
        console.log("Connected to Database");
    }
});

module.exports = db_connection;
