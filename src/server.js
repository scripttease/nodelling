const fetch = require('node-fetch');
const express = require('express');
// secures Express apps by setting various HTTP headers
const helmet = require('helmet');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
const app = express();
const extractSVG = require('../data-handling').extractSVG;
const userStats = require('../data-handling').userStats;


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
    // else
    throw new Error('Username Not Found')
  }).then(function(responseTxt) {
    // const svgObj = extractSVG(responseTxt)
    // return svgObj
    const statsObj = userStats(responseTxt);
    return statsObj;
    // don't want to catch here because want to catch in the app to signify to user.
  });
}

app.get("/streak/:username", function(req, res) {
  // see https://expressjs.com/en/api.html#req.params
  const username = req.params.username
  getUserInfo(username)
    .then(statsObj => {

      //this would also work, if you referrend in the ejs as viewData.svg... give it an object. or just refer to the part of the object you want. In the commented out version you are basically assigning your return from the fnobject that you have assigned
      // res.status(200).render("user-details", {viewData: statsObj} );
      res.status(200).render("user-details", statsObj);
    })
    .catch(error => {
      console.error(error);
      // https://expressjs.com/en/api.html#res.status
      res.status(500).render("error-page");
    });
});




// if i just want this to be an ajax req why does it need a route? (I dont think it can just be ajax because of CORS, i think it actually needs to re-render the whole page? )
app.get('api/streak/:username', function(req, res) {
  // see https://expressjs.com/en/api.html#req.params
  getUserInfo(req.params.username)
    .then(userDetails => {
      // this can send info to the existing view? as json? should be res.send?
      res.setHeader('Content-Type', 'application/json');
      res.json(userDetails);
    })
    .catch(error => {
      console.error(error);
      //TODO make an error page that says username not found
      // https://expressjs.com/en/api.html#res.status
      res.status(500).render("error-page");
    });
});

//TODO write the <script> for the index page that gets the username typed in by the user and then write the ajax that inserts their streak info into page (or render a new page)


module.exports.app = app;
module.exports.getUserInfo = getUserInfo;

