const express = require('express');
const path = require('path');
const posts = require('./data.js');
const app = express()
// setup static
app.use(express.static('./assets'))
app.get('/', (req, res) => {
    // res.sendFile("brown_cv.html")
    res.sendFile(path.resolve(__dirname, 'brown_cv.html'))
});
// app.get('/', (req, res) => {
//     res.status(200).send('Home Page')
// })

app.get('/about', (req, res) => {
    res.status(200).send('About Page')
});
app.get('/api/v1/post', (req, res) => {
    res.status(200).json({ status: true, posts })
});
app.get('/api/v1/post/:id', (req, res) => {
    const _post = posts.find((post) => post.id = req.params.id);
    if (_post) {
        res.status(200).json({ status: true, data: _post });
    }
    return res.status(404).json({ status: false, data: [] });
});
app.post('/api/v1/post/', (req, res) => {
    const { content, img, tags } = req.body;
    if (img) {
        // posts.append([id])
        res.status(201).json({ status: true, data: [...posts, { content, img, tags }] })
    }
    return res.status(400).json({ status: false })
});
app.put('/api/v1/post/:id', (req, res) => {
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
app.delete('/api/v1/post/:id', (req, res) => {
    const _post = posts.find((post) => person.id === Number(req.params.id))
    if (_post) {
        const _newPosts = posts.filter(
            (post) => post.id !== Number(req.params.id)
        )
        return res.status(200).json({ status: true, data: _newPosts })
    }
    res.status(404).json({ success: false })

})

app.all('*', (req, res) => {
    res.status(404).send('<h1>Page not found</h1>')
});
app.listen(9000, () => {
    console.log('Listening on port 9000...')
});