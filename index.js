const http = require('http');

const app = require('./app');

const server = http.createServer(app);

require('dotenv').config()

console.log("PORT is ...",process.env.PORT);

let port = process.env.PORT || 4000;

server.listen(port , ()=>{
    console.log('server running ...');
})

