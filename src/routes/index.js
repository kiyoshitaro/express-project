const express = require('express');
const router = express.Router();
const path = require('path');
const posts = require('../data.js');
const logger = require('../logger');


router.get('/login', (req, res) => {
    logger.debug('Login page');
    res.sendFile(__dirname + '../../public/login.html');
});
router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    res.send(`Username: ${username} Password: ${password}`);
});

router.get('/', (req, res) => {
    // res.sendFile("brown_cv.html")
    res.sendFile(path.resolve(__dirname, '../../public/brown_cv.html'))
});
router.get('/about', (req, res) => {
    res.status(200).send('About Page')
});
router.get('/api/v1/post', (req, res) => {
    res.status(200).json({ status: true, posts })
});
router.get('/api/v1/post/:id', (req, res) => {
    const _post = posts.find((post) => post.id = req.params.id);
    if (_post) {
        res.status(200).json({ status: true, data: _post });
    }
    else {
        logger.error('Not exist ' + post.id);
        res.status(404).json({ status: false, data: [] });
    }
});
router.post('/api/v1/post/', (req, res) => {
    const { content, img } = req.body;
    if (img) {
        res.status(201).json({ status: true, data: [...posts, { content, img }] })
    }
    else {
        logger.error('img field is empty');
        res.status(400).json({ status: false })
    }
});
router.put('/api/v1/post/:id', (req, res) => {
    const { id, content, img, tags } = req.body;
    const _post = posts.find((post) => post.id = id);
    if (_post) {
        const newPosts = posts.map((post) => {
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
        logger.error('Not exist ' + post.id);
        res.status(404).json({ status: false })
    }
});
router.delete('/api/v1/post/:id', (req, res) => {
    const _post = posts.find((post) => person.id === Number(req.params.id))
    if (_post) {
        const _newPosts = posts.filter(
            (post) => post.id !== Number(req.params.id)
        )
        res.status(200).json({ status: true, data: _newPosts })
    }
    else {
        logger.error('Not exist ' + post.id);
        res.status(404).json({ success: false })
    }

})

router.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>')
});

module.exports = router;
