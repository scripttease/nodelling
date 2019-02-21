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


const request = require('supertest');
const app = require('../src/server').app;
const getUserInfo = require('../src/server').getUserInfo;
const startServer = require('../start-server')

describe('user details view', function() {
  
  it('displays different if laterst streak is current streak', function (done) {
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




