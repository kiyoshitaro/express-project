const http = require('http')
const { readFileSync } = require('fs')

const homePage = readFileSync('brown_cv.html')

const server = http.createServer((req, res) => {
    console.log(url)
    const url = req.url
    if (url === '/') {
        res.writeHead(200, { 'content-type': 'text/html' })
        res.write(homePage)
        res.end()
    }
})

server.listen(5000)