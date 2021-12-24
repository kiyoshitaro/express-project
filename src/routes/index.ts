// const express = require('express');
import express from "express";
const router = express.Router();
import path from "path";
import session from "express-session";
import Home from '../controllers/Home';
import About from '../controllers/About';
import Posts from '../controllers/Posts';
import NotFound from '../controllers/NotFound';
import Account from '../controllers/Account';

// const logger = require('../logger');
// const database = require('../sqlConnection');

// router.get("/getMysqlStatus", (req, res) => {
//     database.ping((err) => {
//         if (err) return res.status(500).send("MySQL Server is Down");
//         database.query('SELECT * FROM city LIMIT 30', (error, results, fields) => {
//             res.status(200).json({
//                 status: true, data: results
//             });
//         })
//     })
// });

// Creating session variables for clients, this will determine if an user is logged in or not.
// https://codeshack.io/basic-login-system-nodejs-express-mysql/
router.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
// router.get('/account/:id', async (req, res) => {
//     // logger.debug('Login page');
//     const address = req.params.id;
//     const { data: balance } = await api.query.system.account(address);
//     // console.log(`${address} has ${balance.free / DOT_DECIMAL_PLACES} KSM ( ${balance.free} raw )`);
//     res.status(200).json({ status: true, balance })
// });
// router.get('/', (req, res) => {
//     // logger.debug('Login page');
//     res.sendFile(path.resolve(__dirname, '../../public/login.html'));
// });
// router.post('/login', (req, res) => {
//     var username = req.body.username;
//     var password = req.body.password;
//     if (username && password) {
//         database.query('SELECT * FROM accounts WHERE username = ? AND password = ?', [username, password], function (error, results, fields) {
//             if (results.length > 0) {
//                 req.session.loggedin = true;
//                 req.session.username = username;
//                 res.redirect('/home');
//             } else {
//                 res.send('Incorrect Username and/or Password!');
//             }
//         });
//     } else {
//         res.send('Please enter Username and Password!');
//     }
// });
router.get('/home', Home.index);
router.get('/about', About.index);
router.get('/api/v1/post', Posts.GetAll);
router.get('/api/v1/post/:id', Posts.GetOne);
router.post('/api/v1/post/', Posts.Post);
router.put('/api/v1/post/:id', Posts.Put);
router.delete('/api/v1/post/:id', Posts.Delete);

router.get('/api/v1/account/:id', Account.GetOne);
router.get('/api/v1/account', Account.Post);

router.all('*', NotFound.index);

export default router;
