const fs  = require('fs');
const chai = require('chai');
const should = chai.should();
const dataHandling = require('../data-handling').dataHandling;
const extractData = require('../data-handling').extractData;
const countStreak = require('../data-handling').countStreak;
const longestStreak = require('../data-handling').longestStreak;
const streakDates = require('../data-handling').streakDates;
const extractSVG = require('../data-handling').extractSVG;
const userStats = require('../data-handling').userStats;

const { getMainLang, getLangUris } = require('../github-api');

// const { dataHandling, extractData, countStreak, longestStreak, streakDates, extractSVG, userStats } = require('../data-handling'); 

// const dataHandling = require('../data-handling'); 

describe("getLanguages", function() {

  before(function(done) {
    // Reads test file and converts to JSON so that it will have same format as the data I request
    //TODO make this relative
    fs.readFile('/Users/al/projects/nodelling/test/api-test-data.txt', 'utf8', function(err, fileContents,) {
      if (err) throw(err);

      // async has no return hence need done
      apiData = fileContents
      done();
    })
  });

  describe('getMainLang', function() {
    it('should take data and return array of langs', () => {
        const reposObj = JSON.parse(apiData);
        const langArray = getMainLang(reposObj)
        // console.log(langArray)
        expect(langArray.length).to.equal(28)
        expect(langArray[1].lang).to.equal('Scala')

    });
  })
  
  describe('getLangUris', function() {
    it('should take data and return array of langs uris', () => {
        const reposObj = JSON.parse(apiData);
        const langArray = getLangUris(reposObj)
        // console.log(langArray)
        expect(langArray.length).to.equal(30)
        expect(langArray[0].langUri).to.equal('https://api.github.com/repos/scripttease/connect-js/languages')

    });
  })

})