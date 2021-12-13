const express = require('express');
const app = express()
const routes = require('./routes/index');
const path = require('path');
const database = require('./sqlConnection');
app.get("/getMysqlStatus", (req, res) => {
    database.ping((err) => {
        if (err) return res.status(500).send("MySQL Server is Down");
        database.query('SELECT * FROM city LIMIT 30', (error, results, fields) => {
            res.status(200).json({
                status: true, data: results
            });
        })
    })
});

// setup static
app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static(path.join(__dirname, '../public/assets')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', routes);

app.listen(9000, () => {
    console.log('Listening on port 9000...')
});