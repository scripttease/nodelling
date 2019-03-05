const fs  = require('fs');
const chai = require('chai');
const should = chai.should();

const { dataHandling, extractData, countStreak, longestStreak, streakDates, extractSVG, userStats, langDataSort, cssValidLangName, } = require('../src/data-handling')

const { getLangUris, } = require('../src/github-api')

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

    before(function(done) {
    //TODO make this relative
    fs.readFile('/Users/al/projects/nodelling/test/test-repo-data.txt', 'utf8', function(err, fileContents,) {
      if (err) throw(err);

      data4 = fileContents;
      done();
    })
  });

  // 22 because 8 are forks
  it('should have 22 obj in data4', () => {
    const data4test = data4

    const langObj = JSON.parse(data4)
    // console.log(langObj)
    const langUrisObj = getLangUris(langObj);
    // console.log(langUrisObj)
    expect(langUrisObj.length).to.equal(22)

  })

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


  describe('#longestStreak with curr and longest same', function() {
    it(' should count consecutive streaks and return longest', () => {

      const testStreakArray = [
        { streak: 1, endDate: 1, startDate: 2 },
        { streak: 2, endDate: 2, startDate: 3 },
        { streak: 6, endDate: 3, startDate: 4 },
        { streak: 1, endDate: 4, startDate: 5 },
        { streak: 1, endDate: 5, startDate: 6 },
        { streak: 1, endDate: 6, startDate: 7 },
        { streak: 9, endDate: 7, startDate: 8 },
        { streak: 1, endDate: 8, startDate: 9 },
        { streak: 1, endDate: 9, startDate: 10 },
        { streak: 6, endDate: 10, startDate: 11 },
        { streak: 1, endDate: 11, startDate: 12 },
        { streak: 1, endDate: 12, startDate: 13 },
        { streak: 9, endDate: 13, startDate: 14 },
      ]

      const longest = longestStreak(testStreakArray)
      expect(longest.streak).to.equal(9);
      expect(longest.endDate).to.equal(13);
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
      // console.log(streakArr);
      // console.log(longest);
      // console.log(str);
      expect(stats.longestStreakEnd).to.equal('Tue Aug 07 2018')
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

describe('langDataSort', () => {
 it('should take a lang obj and process it', () => {
   const langDataObj = { JavaScript: 317581,
    Scala: 131638,
    SuperCollider: 13,
    Ruby: 333298,
    HTML: 223061,
    'Vim script': 78029,
    Shell: 33143,
    Elixir: 17939,
    CSS: 119758,
    Python: 6342896,
    Groovy: 298,
    Makefile: 2056,
    HCL: 144,
    Processing: 10744,
    'Jupyter Notebook': 627,
    C: 3972,
    CoffeeScript: 844 }
    const res = langDataSort(langDataObj)
    // console.log(res);
    expect(res[0].language).to.equal('SuperCollider')
 }) 
})


});



describe('cssValidLangName', function () {
  it('takes string and retrns css valid string', () => {
    const name = 'Vim Script'
    const name2 = 'C++'
    expect(cssValidLangName(name)).to.equal('vimscript')
    expect(cssValidLangName(name2)).to.equal('cx')
    expect(cssValidLangName('F#')).to.equal('fx')
  })
})