const fs  = require('fs');
const chai = require('chai');
const should = chai.should();

const dataHandling = require('../src/data-handling').dataHandling;
const extractData = require('../src/data-handling').extractData;
const countStreak = require('../src/data-handling').countStreak;
const longestStreak = require('../src/data-handling').longestStreak;
const streakDates = require('../src/data-handling').streakDates;
const extractSVG = require('../src/data-handling').extractSVG;
const userStats = require('../src/data-handling').userStats;


const request = require('supertest');
const app = require('../src/server').app;
const getUserInfo = require('../src/server').getUserInfo;
const startServer = require('../start-server')

describe('user details view', function() {
  useMockServersForThisDescribeBlock();
  
  it('displays differently if latest streak is current streak', function (done) {
    request(app)
      .get('/streak/lpil')
      .expect(200)
      .end(function(err, res) {
        // console.log(res) // shows you the fields
        const pattern = /class="js-calendar-graph-svg"/
        expect(res.text).to.match(pattern)
        expect(res.text).to.match(/current streak/)

        done();
      });
  })
})




