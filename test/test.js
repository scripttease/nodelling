const fs  = require('fs');
// const fileName = './user-test-data.txt'
const chai = require('chai');
const server = require('../server');
const dataHandling = require('../data-handling').dataHandling;
const extractData = require('../data-handling').extractData;
const countStreak = require('../data-handling').countStreak;
const longestStreak = require('../data-handling').longestStreak;
// const testData = require('./user-test-data.txt');
const should = chai.should();

// TODO how could i use const here when I want the data available elsewhere in scope?

describe("dataHandling", function() {

  before(function(done) {
    // Reads test file and converts to JSON so that it will have same format as the data I request
    //TODO make this relative
    fs.readFile('/Users/al/projects/nodelling/test/user-test-data.txt', 'utf8', function(err, fileContents,) {
      if (err) throw(err);

      done();
      return data = JSON.stringify(fileContents);
    })
    // return data;
  });


  it('should split data into array of lines', function() {
    const stringOut = dataHandling(data);

    // expect(stringOut.length).to.equal(577)
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
        // date: '2018-02-14',
      }
      console.log(expectedOut);
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

});

// it("should convert json to string", function() {
//   const stringOut = dataHandling(data);

//   // console.log(data);
//   expect(stringOut.charAt(1)).to.equal('<')
// });
