// see https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai?utm_source=medium&utm_medium=post&utm_campaign=how-to-run-mocha-chai-unit-tests-on-node-js-apps&utm_content=link

// const request = require('request');
const request = require('supertest');
const app = require('../src/server').app;
const startServer = require('../start-server')

const { getUserInfo, getApiInfo, getLangInfo, getPaginationInfoFromHeader, getApiHeaders, paginatedUserRepoUris, range, getLanguageUriForRepo, getUserLangStats, } = require('../src/server');

describe("server tests", () => {
  useMockServersForThisDescribeBlock();

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
          expect(res.text).to.match(/Your Github Stats/)

          done();
        });

    });
  });


  describe('getApiInfo', function() {
    it('should take username and return contribs json', function() {
      const username = 'scripttease'
      return getApiInfo(username).then(function(langUriObj) {
        expect(langUriObj.length).to.equal(22)
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
    }).timeout(5000)
  });

  describe('getPaginationInfoFromHeader', () => {
    it('gets link headers', () => {
      const username = 'scripttease'
      return getPaginationInfoFromHeader(username).then(function(headers) {
        //see headers api
        //https://developer.mozilla.org/en-US/docs/Web/API/Headers#Examples
        // const headersLink = headers.get('link')
        expect(headers).to.equal('<https://api.github.com/user/16262154/repos?page=2>; rel="next", <https://api.github.com/user/16262154/repos?page=3>; rel="last"')
      })
    }).timeout(5000)
  })

  describe('parseHeadersLink', () => {
    it('should extract the number of pages and create the uris to get them all', () => {
      const headersLink = '<https://api.github.com/user/16262154/repos?page=2>; rel="next", <https://api.github.com/user/16262154/repos?page=3>; rel="last"'

      const reposUris = paginatedUserRepoUris(headersLink)
      expect(reposUris).to.deep.equal([ "http://localhost:7599/user/16262154/repos?page=1"
      ,"http://localhost:7599/user/16262154/repos?page=2"
      ,"http://localhost:7599/user/16262154/repos?page=3"])
    })
  })

  describe('range', () => {
    it('should return a range', () => {
      expect(range(6)).to.deep.equal([0,1,2,3,4,5])
      
    })
  })  

  describe('getLanguageUriForRepo', function() {
    it('should take uri and return repos obj', function() {
      const uri = 'https://api.github.com/user/16262154/repos?page=1'
      return getLanguageUriForRepo(uri).then(function(langUriObj) {
        expect(langUriObj.length).to.equal(22)
        expect(langUriObj[0].langUri).to.equal('https://api.github.com/repos/scripttease/connect-js/languages')

      })
    }).timeout(5000)
  });

  describe('getLanguageUriForRepo2', function() {
    it('should take uri2 and return repos obj', function() {
      const uri2 = 'https://api.github.com/user/16262154/repos?page=2'
      return getLanguageUriForRepo(uri2).then(function(langUriObj) {
        expect(langUriObj.length).to.equal(27)
        expect(langUriObj[0].langUri).to.equal('https://api.github.com/repos/scripttease/pontoon-js/languages')
      })
    });
  })

  // because is a fork
  describe('getLanguageUriForRepo3', function() {
    it('should take uri3 and return repos obj', function() {
      const uri3 = 'https://api.github.com/user/16262154/repos?page=3'
      return getLanguageUriForRepo(uri3).then(function(langUriObj) {
        expect(langUriObj.length).to.equal(0)
      })
    });
  })

  describe('getUserLangStats', () => {
    it('should take a username and call 3 uris and get langUrisObj', () => {
      const username = 'scripttease'
      // const langUrisObj = doAllTheThings(username)
      // expect(langUrisObj).to.deep.equal({})
      return getUserLangStats(username).then(function(allsorteddata) {
        // console.log(langUriObj);
        expect(allsorteddata[0].count).to.equal(13)
      })
      // or timesout after 2s which is not enough
    }).timeout(8000)
  })  

  describe('getUserLangStats 2', () => {
    it('should take a username(2) and call 3 uris and get langUrisObj', () => {
      const username = 'lpil'
      // const langUrisObj = doAllTheThings(username)
      // expect(langUrisObj).to.deep.equal({})
      return getUserLangStats(username).then(function(langUriObj) {
        // console.log(langUriObj);
        expect(langUriObj[0]).to.deep.equal({'count':46, 'language': 'Standard ML'})
      })
      // or timesout after 2s which is not enough
    }).timeout(8000)
  })  
})