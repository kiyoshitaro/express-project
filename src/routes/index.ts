// const express = require('express');
import express from "express";
const router = express.Router();
import path from "path";
import session from "express-session";
import { provider, DOT_DECIMAL_PLACES } from "../service";
import { ApiPromise } from '@polkadot/api';
const posts = require('../data.js');
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
router.get('/account/:id', async (req, res) => {
    // logger.debug('Login page');
    const address = req.params.id;
    const api = await ApiPromise.create({ provider });
    const { data: balance } = await api.query.system.account(address);
    // console.log(`${address} has ${balance.free / DOT_DECIMAL_PLACES} KSM ( ${balance.free} raw )`);
    res.status(200).json({ status: true, balance })
});

router.get('/', (req, res) => {
    // logger.debug('Login page');
    res.sendFile(path.resolve(__dirname, '../../public/login.html'));
});
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

router.get('/home', (req, res) => {
    // if (req.session.loggedin) {
    res.status(200).sendFile(path.resolve(__dirname, '../../public/login.html'))
    // } else {
    //     res.redirect('/');
    // }
});
router.get('/about', (req, res) => {
    res.status(200).send('About Page')
});
router.get('/api/v1/post', (req, res) => {
    res.status(200).json({ status: true, posts })
});
router.get('/api/v1/post/:id', (req, res) => {
    const _post = posts.find((post: any) => post.id = req.params.id);
    if (_post) {
        res.status(200).json({ status: true, data: _post });
    }
    else {
        // logger.error('Not exist ' + post.id);
        res.status(404).json({ status: false, data: [] });
    }
});
router.post('/api/v1/post/', (req, res) => {
    const { content, img } = req.body;
    if (img) {
        res.status(201).json({ status: true, data: [...posts, { content, img }] })
    }
    else {
        // logger.error('img field is empty');
        res.status(400).json({ status: false })
    }
});
router.put('/api/v1/post/:id', (req, res) => {
    const { id, content, img, tags } = req.body;
    const _post = posts.find((post: any) => post.id = id);
    if (_post) {
        const newPosts = posts.map((post: any) => {
            if (post.id === Number(id)) {
                post.content = content;
                post.img = img;
                post.tags = tags;
            }
            return post
        })
        res.status(200).json({ status: true, data: newPosts })
    }
    else {
        // logger.error('Not exist ' + post.id);
        res.status(404).json({ status: false })
    }
});
router.delete('/api/v1/post/:id', (req, res) => {
    const _post = posts.find((post: any) => post.id === Number(req.params.id))
    if (_post) {
        const _newPosts = posts.filter(
            (post: any) => post.id !== Number(req.params.id)
        )
        res.status(200).json({ status: true, data: _newPosts })
    }
    else {
        // logger.error('Not exist ' + post.id);
        res.status(404).json({ success: false })
    }

})

router.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>')
});

export default router;
// module.exports = router;
