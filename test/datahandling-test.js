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


    before(function(done) {
    //TODO make this relative
    fs.readFile('/Users/al/projects/nodelling/test/user-test-data3.txt', 'utf8', function(err, fileContents,) {
      if (err) throw(err);

      data3 = fileContents;
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
      // console.log(streakArr);
      expect(streakArr.length).to.equal(24);

    });
  });


  describe('#countStreak with data3', () => {
    it('longest streak should be current streak', () => {

      const stringOut = dataHandling(data3);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      // console.log(streakArr[streakArr.length -1]);
      lastStr = streakArr[streakArr.length -1];
      expect(lastStr.streak).to.equal(24);

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
      expect(str.longestAsString).to.equal('In the last year, your longest streak was 4 days, logged from Sat Oct 06 2018 to Tue Oct 09 2018.')
    });
  });

  describe('#streakDates 2', () => {
    it('should return date as stringfrom data2', function() {

      const stringOut = dataHandling(data2);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      const longest = longestStreak(streakArr)
      const str = streakDates(longest)
      expect(str.longestAsString).to.equal('In the last year, your longest streak was 23 days, logged from Mon Jul 16 2018 to Tue Aug 07 2018.')
    });
  });

  describe('extractSVG', function() {
    it('should extract the svg to render in view', function() {
      const pattern = /class="js-calendar-graph-svg"/
      // console.log(extractSVG(data));
      const svgObj = extractSVG(data)
      expect(svgObj.svg).to.match(pattern);
    });
  });
  
  describe('userStats', function() {
    it('should return all the data the view needs', function() {
      
      const stats = userStats(data);
      const days = stats.longestStreakLength;
      const end = stats.longestStreakEnd;
      expect(days).to.equal(4);
      expect(stats.longestStreakEnd).to.equal('Tue Oct 09 2018')
    });
  });
  

//TODO test lpil data set 2!! where 2 same length longest streaks make sure it choses most recent.
  describe('userStats with data2', function() {
    it('should return all the data the view needs', function() {
      
      const stats = userStats(data2);
      const days = stats.longestStreakLength;
      const end = stats.longestStreakEnd;

      const stringOut = dataHandling(data2);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      const longest = longestStreak(streakArr)
      const str = streakDates(longest)
      console.log(streakArr);
      console.log(longest);
      console.log(str);
      expect(stats.longestStreakEnd).to.equal('Wed Feb 20 2019')
    });
  });

  describe('userStats with data3', function() {
    it('should return all the data the view needs', function() {
      
      const stats = userStats(data3);
      const days = stats.longestStreakLength;
      const end = stats.longestStreakEnd;

      const stringOut = dataHandling(data3);
      const objOut = extractData(stringOut);
      const streakArr = countStreak(objOut);
      const longest = longestStreak(streakArr)
      const str = streakDates(longest)
      // console.log(streakArr);
      // console.log(longest);
      // console.log(str);
      expect(stats.longestStreakEnd).to.equal('Thu Feb 21 2019')
    });
  });
});
