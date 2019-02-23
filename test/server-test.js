// see https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai?utm_source=medium&utm_medium=post&utm_campaign=how-to-run-mocha-chai-unit-tests-on-node-js-apps&utm_content=link

// const request = require('request');
const request = require('supertest');
const app = require('../src/server').app;
const startServer = require('../start-server')

const { getUserInfo, getApiInfo, getLangInfo, getApiHeaders, parseHeadersLink, range, } = require('../src/server');

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
    return getUserInfo(username).then(function(svgObj) {
      expect(svgObj.svg).to.match(/js-calendar-graph-svg/)
      expect(svgObj.svg).not.to.match(/js-yearly-contributions/)
    })
  });
});


describe('GET /streak/lpil', function () {
  it('responds calling getuserinfo and renders user-details', function (done) {
    request(app)
      .get('/streak/lpil')
      // .expect('Content-Type', "text/html; charset=utf-8")
      .expect(200)
      // endpoint
      .end(function(err, res) {
        //use a regex match here so can just see part
        // console.log(res) // shows you the fields
        const pattern = /class="js-calendar-graph-svg"/
        expect(res.text).to.match(pattern)
        expect(res.text).to.match(/User Deets/)

        done();
      });

  });
});


describe('getApiInfo', function() {
  it('should take username and return contribs json', function() {
    const username = 'scripttease'
    return getApiInfo(username).then(function(langUriObj) {
      expect(langUriObj.length).to.equal(30)
      expect(langUriObj[0].langUri).to.equal('https://api.github.com/repos/scripttease/connect-js/languages')
    })
  });
});

describe('getLangInfo', function() {
  it('take the array of lang uris and fetch each and create a new object array ', function() {
    const username = 'scripttease'
    const uriArray = [ { langUri:
      'https://api.github.com/repos/scripttease/connect-js/languages' },
   { langUri:
      'https://api.github.com/repos/scripttease/coursera-progfun/languages' },
   { langUri:
      'https://api.github.com/repos/scripttease/coursera-scala/languages' },
   { langUri: 'https://api.github.com/repos/scripttease/crawley/languages' },
   { langUri: 'https://api.github.com/repos/scripttease/dogma/languages' },
   { langUri: 'https://api.github.com/repos/scripttease/domi-js/languages' }]

    return getLangInfo(uriArray).then(function(langObjArray) {
      expect(langObjArray.length).to.equal(6)
      // console.log(Object.keys(langObjArray[0]))
      // console.log(langObjArray);
      
      expect(Object.keys(langObjArray[0])).to.deep.equal(['JavaScript'])
    })
  });
});

describe('getApiHeaders', () => {
  it('gets link headers', () => {
    const username = 'scripttease'
    return getApiHeaders(username).then(function(headers) {
      //see headers api
      //https://developer.mozilla.org/en-US/docs/Web/API/Headers#Examples
      const headersLink = headers.get('link')
      expect(headersLink).to.equal('<https://api.github.com/user/16262154/repos?page=2>; rel="next", <https://api.github.com/user/16262154/repos?page=3>; rel="last"')
    })
  })
})

describe('parseHeadersLink', () => {
  it('should extract the number of pages and create the uris to get them all', () => {
    const headersLink = '<https://api.github.com/user/16262154/repos?page=2>; rel="next", <https://api.github.com/user/16262154/repos?page=3>; rel="last"'

    const reposUris = parseHeadersLink(headersLink)
    expect(reposUris).to.deep.equal(['https://api.github.com/user/16262154/repos?page=1','https://api.github.com/user/16262154/repos?page=2', 'https://api.github.com/user/16262154/repos?page=3'])
  })
})

describe('range', () => {
  it('should return a range', () => {
    expect(range(6)).to.deep.equal([0,1,2,3,4,5])
    
  })
})  