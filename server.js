var express = require('express');
var app = express();
var port = process.env.PORT || 1234;

app.get('/', function(req, res) {
  res.send('Hello World!');
});

// this module.parent allows test watcher to run by checking that not already listening, see http://www.marcusoft.net/2015/10/eaddrinuse-when-watching-tests-with-mocha-and-supertest.html
if(!module.parent){ 
  app.listen(port, function(err) {
    if (err) {
      console.log(err);
    } else {
  console.log('Example app listening on port ' + port);
    }
});
}
