const fs  = require('fs');
const chai = require('chai');
const dataHandling = require('../data-handling').dataHandling;
const extractData = require('../data-handling').extractData;
const countStreak = require('../data-handling').countStreak;
const longestStreak = require('../data-handling').longestStreak;
const streakDates = require('../data-handling').streakDates;
const extractSVG = require('../data-handling').extractSVG;
const should = chai.should();

describe("dataHandling", function() {

  before(function(done) {
    // Reads test file and converts to JSON so that it will have same format as the data I request
    //TODO make this relative
    fs.readFile('/Users/al/projects/nodelling/test/user-test-data.txt', 'utf8', function(err, fileContents,) {
      if (err) throw(err);

      // async has no return hence need done
      data = fileContents
      done();
    })
  });

    before(function(done) {
    //TODO make this relative
    fs.readFile('/Users/al/projects/nodelling/test/user-test-data2.txt', 'utf8', function(err, fileContents,) {
      if (err) throw(err);

      data2 = fileContents;
      done();
    })
  });

  it('should split data into array of lines', function() {
    const stringOut = dataHandling(data);

    expect(stringOut.length).to.equal(577)
  });

  describe('extractData', function() {
    it('should return array of objects', () => {

      const stringOut = dataHandling(data);
      // console.log(stringOut[9]);
      const objOut = extractData(stringOut);
      // console.log(objOut[3]);
      const expectedOut = {
        commits: 0,
        date: Date.parse('2018-02-14'),
      }
      // console.log(expectedOut);
      expect(objOut[3]).to.deep.equal(expectedOut)

    });
  })

  describe('#countStreak', () => {
    it('should creat array of streak objects with date', () => {

      const stringOut = dataHandling(data);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      expect(streakArr.length).to.equal(24);

    });
  });

  describe('#longestStreak', function() {
    it(' should count consecutive streaks and return longest', () => {

      const stringOut = dataHandling(data);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      // console.log(streakArr);
      const longest = longestStreak(streakArr)
      expect(longest.streak).to.equal(4);


    });
  });

  describe('#streakDates', () => {
    it('should return date as string', function() {

      const stringOut = dataHandling(data);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      const longest = longestStreak(streakArr)
      const str = streakDates(longest)
      expect(str).to.equal('In the last year, your longest streak was 4 days, logged from Sat Oct 06 2018 to Tue Oct 09 2018.')
    });
  });

  describe('#streakDates 2', () => {
    it('should return date as stringfrom data2', function() {

      const stringOut = dataHandling(data2);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      const longest = longestStreak(streakArr)
      const str = streakDates(longest)
      expect(str).to.equal('In the last year, your longest streak was 23 days, logged from Mon Jul 16 2018 to Tue Aug 07 2018.')
    });
  });

  describe('extractSVG', function() {
    it('should extract the svg to render in view', function() {
      const pattern = /class="js-calendar-graph-svg"/
      // console.log(extractSVG(data));
      expect(extractSVG(data)).to.match(pattern);
    });
  });
  

});
