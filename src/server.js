const fetch = require('node-fetch');
const express = require('express');
// secures Express apps by setting various HTTP headers
const helmet = require('helmet');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
const app = express();
const extractSVG = require('../data-handling').extractSVG;


// https://expressjs.com/en/starter/static-files.html
// serve static files from dir 'public'
app.use(express.static('public'))
// set templating engine to ejs
// https://github.com/mde/ejs or https://ejs.co/
app.set('view engine', 'ejs');
app.use(helmet());
app.use(morgan("dev"));


app.get("/", function(req, res) {
  res.render("index");
});


function getUserInfo(username) {
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  // https://scotch.io/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
  return fetch("https://github.com/users/" + username + "/contributions").then(function(response) {
    if (response.ok) {
      // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
      return response.text();
    }
    throw new Error('Username Not Found')
  }).then(function(responseTxt) {
    return extractSVG(responseTxt);
    // don't want to catch here because want to catch in the app to signify to user.
    // }).catch(function(error) {
    //   console.log('There has been a problem with your fetch operation: ', error);
  });
}

app.get("/streak", function(req, res) {
  getUserInfo(req.params.username)
    .then(userDetails => {
      res.render("user-details-json", userDetails);
    })
    .catch(error => {
      console.error(error);
      res.code(500).render("error-page");
    });
});



module.exports.app = app;
module.exports.getUserInfo = getUserInfo;

