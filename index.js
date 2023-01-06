const http = require('http');

const app = require('./app');

const server = http.createServer(app);

let port = process.env.PORT || 4000;

server.listen(port , ()=>{
    console.log('server running ...');
})

