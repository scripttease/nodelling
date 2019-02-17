// see https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai?utm_source=medium&utm_medium=post&utm_campaign=how-to-run-mocha-chai-unit-tests-on-node-js-apps&utm_content=link

// const request = require('request');
const request = require('supertest');
const app = require('../src/server').app;
const getUserInfo = require('../src/server').getUserInfo;
const startServer = require('../start-server')

describe('GET /', function () {
  it('responds rendering index.ejs and status 200 ok', function (done) {
    request(app)
      .get('/')
      .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
      // endpoint
      .end(function(err, res) {
        //use a regex match here so can just see part
        // console.log(res) // shows you the fields
        expect(res.text).to.match(/Git Streak/)
        done();
      });

  });
});

describe('getUserInfo', function() {
  it('should take username and return contribs json', function() {
    const username = 'scripttease'
    //testing a promise so need its own promise or to use done.
    return getUserInfo(username).then(function(svg) {
      expect(svg).to.match(/js-calendar-graph-svg/)
    })
  });
  
});

