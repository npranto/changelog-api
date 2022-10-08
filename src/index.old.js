const http = require('http');

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    console.log('Welcome to your server!')
    res.end();
  }
});

server.listen(3001, () => {
  console.log('Listening to PORT - 3001');
})