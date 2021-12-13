const express = require('express');
const app = express()
const routes = require('./routes/index');
const path = require('path');
// setup static
app.use(express.static(path.join(__dirname, '../public')));
// app.use(express.static(path.join(__dirname, '../public/assets')));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use('/', routes);

app.listen(9000, () => {
    console.log('Listening on port 9000...')
});