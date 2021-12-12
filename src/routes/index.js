const express = require('express');
const router = express.Router();
const path = require('path');
const posts = require('../data.js');

router.get('/', (req, res) => {
    // res.sendFile("brown_cv.html")
    res.sendFile(path.resolve(__dirname, '../../public/brown_cv.html'))
});
// router.get('/', (req, res) => {
//     res.status(200).send('Home Page')
// })

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
    return res.status(404).json({ status: false, data: [] });
});
router.post('/api/v1/post/', (req, res) => {
    const { content, img, tags } = req.body;
    if (img) {
        // posts.routerend([id])
        res.status(201).json({ status: true, data: [...posts, { content, img, tags }] })
    }
    return res.status(400).json({ status: false })
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
    return res.status(404).json({ status: false })
});
router.delete('/api/v1/post/:id', (req, res) => {
    const _post = posts.find((post) => person.id === Number(req.params.id))
    if (_post) {
        const _newPosts = posts.filter(
            (post) => post.id !== Number(req.params.id)
        )
        return res.status(200).json({ status: true, data: _newPosts })
    }
    res.status(404).json({ success: false })

})

router.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>')
});

module.exports = router;
