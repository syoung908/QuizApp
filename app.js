const server = require('./server');

const PORT = process.env.PORT || 8080;

server.listen(PORT, function() {
  //console.log('Server listening on port: ' + PORT);
  //console.log(`mode: ${process.env.NODE_ENV}`);
});
