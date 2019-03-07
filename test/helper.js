global.expect = require("chai").expect;
process.env.NODE_ENV = "test"

global.useMockServersForThisDescribeBlock = function() {
  const http = require('http');
  const yakbak = require('yakbak');
  let githubApiServer;
  let githubServer;

  global.before((done) => {
    const handler = yakbak('https://api.github.com', {
      dirname: __dirname + '/tapes/api.github.com'
    })

    githubServer = http.createServer(handler).listen(7599, () => {
      const handler = yakbak('https://github.com', {
        dirname: __dirname + '/tapes/github.com'
      })
      githubApiServer = http.createServer(handler).listen(7598, done);
    });
  })

  global.after(done => {
    githubServer.close(() => {
      githubApiServer.close(done);
    })
  });
}