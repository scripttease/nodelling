const fetch = require('node-fetch');
const express = require('express');
// secures Express apps by setting various HTTP headers
const helmet = require('helmet');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
const app = express();

const extractSVG = require('../data-handling').extractSVG;
const userStats = require('../data-handling').userStats;

const { getMainLang, getLangUris, combineLangData, } = require('../github-api');

// https://expressjs.com/en/starter/static-files.html
// serve static files from dir 'public'
app.use(express.static('public'))
// set templating engine to ejs
// https://github.com/mde/ejs or https://ejs.co/
app.set('view engine', 'ejs');
app.use(helmet());
app.use(morgan("dev"));


app.get("/", function (req, res) {
  res.render("index");
});


function getUserInfo(username) {
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  // https://scotch.io/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
  return fetch("https://github.com/users/" + username + "/contributions", {
    headers: {
      "Content-Type": "application/json",'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
 
    },
  })
    .then(function (response) {
      if (response.ok) {
        // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#Checking_that_the_fetch_was_successful
        return response.text();
      }
      // else
      throw new Error('Username Not Found')
    }).then(function (responseTxt) {
      // const svgObj = extractSVG(responseTxt)
      // return svgObj
      const statsObj = userStats(responseTxt);
      return statsObj;
      // don't want to catch here because want to catch in the app to signify to user.
    });
}

app.get("/streak/:username", function (req, res) {
  // see https://expressjs.com/en/api.html#req.params
  const username = req.params.username
  getUserInfo(username)
    .then(statsObj => {
      // console.log(statsObj);
      // This would also work, if you referrend in the ejs as viewData.svg...
      // give it an object. or just refer to the part of the object you want. In
      // the commented out version you are basically assigning your return from
      // the fnobject that you have assigned
      // res.status(200).render("user-details", {viewData: statsObj} );
      res.status(200).render("user-details", statsObj);
    })
    .catch(error => {
      console.error(error);
      // https://expressjs.com/en/api.html#res.status
      res.status(500).render("error-page");
    });
});




// if i just want this to be an ajax req why does it need a route? (I dont think
// it can just be ajax because of CORS, i think it actually needs to re-render
// the whole page? )
app.get('api/streak/:username', function (req, res) {
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

//TODO these do not paginate so will only collect say first 30 need to adjust the uris
//api.github.com/users/scripttease/repos
function getApiHeaders(username) {

  return fetch("https://api.github.com/users/" + username + "/repos", {
    headers: {
      "Content-Type": "application/json",'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
 
    },
  }).then(function (response) {
    // console.log(response)
    if (response.ok) {
      // console.log(response.headers);
      return response.headers.get('link');
    }
    // else
    const error = new Error(response.statusText)
    error.response = response
    throw error
  });
}

function range(n) {
  return [...Array(n).keys()];
}

function parseHeadersLink(headersLink) {
  const regex = /(https:\/\/api\.github\.com\/user\/([0-9]+)\/repos\?page\=)([0-9]+)\>; rel\="last"/gm;
  const matches = regex.exec(headersLink);
  const numPages = parseInt(matches[3])
  const array1 = range(numPages)
  const array2 = array1.map(x => x + 1)
  const res = array2.map(page => '' + matches[1] + page);
  return res
}

function doAllTheThings(username) {
  return getApiHeaders(username)
    .then(linkHeader => {
      // console.log(linkHeader);
      const reposUriArray = parseHeadersLink(linkHeader);
      // console.log(reposUriArray);
      const promiseArray = reposUriArray.map(uri => {
        return getApiInfoUri(uri)
      })

      return Promise.all(promiseArray)
    })
    .then(nestedRepoLangArray => {
      // console.log(nestedRepoLangArray);
      const repoLangArray = nestedRepoLangArray.flat()

      return getLangInfo(repoLangArray)
    }).then(langArrayObj => {
      // console.log(langArrayObj);

      // return combineLangData(langArrayObj).then(langDataObj => {
      //   console.log(langDataObj);
      //   return(langDataObj)
      // })
      // console.log(combineLangData(langArrayObj));
      return combineLangData(langArrayObj)
   })
}

// function doAllTheThingsPseudocode(username) {
//   return getApiHeaders(username)
//     .then(getLangDataFromPages)
//     .then(nestedLangData => nestedLangData.flat())
//     .then(combineLangData)
// }
// const getLangDataFromPages = headers => {
//   const pagesOfRepos = parseHeadersLink(header);
//   const repos = pagesOfRepos.map(getPageOfRepos)
//   return Promise.all(repos)
// }

// const getPageOfRepos = pageUri => {
//   getApiInfoUri(page)
//     .then(repos => Promise.all(repos.map(getLangInfo)))
// }

/*
1. Look up how many pages of pagination there are (in headers)
2. Construct pagination URIs from this info
3. make a request to each URI to get repo info
4. make a reques to for each repo to get languages
5. count language stats for all repos together
*/

function getApiInfoUri(uri) {
  return fetch(uri, { headers: {
      "Content-Type": "application/json", 'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
    },
  }).then(function (response) {
    // console.log(response)
    if (response.ok) {
      return response.text();
    }
    // else
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }).then(function (responseTxt) {
    const langObj = JSON.parse(responseTxt)
    // console.log(langObj)
    const langUrisObj = getLangUris(langObj);
    // console.log(langUrisObj)
    return langUrisObj;
    // don't want to catch here because want to catch in the app to signify to user.
  });
}

function getApiInfo(username) {
  return fetch("https://api.github.com/users/" + username + "/repos", {
    headers: {
      "Content-Type": "application/json", 'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
    },
  }).then(function (response) {
    // console.log(response)
    if (response.ok) {
      return response.text();
    }
    // else
    const error = new Error(response.statusText)
    error.response = response
    throw error
  }).then(function (responseTxt) {
    const langObj = JSON.parse(responseTxt)
    // console.log(langObj)
    const langUrisObj = getLangUris(langObj);
    // console.log(langUrisObj)
    return langUrisObj;
    // don't want to catch here because want to catch in the app to signify to user.
  });
}

function getLangInfo(langUrisObj) {
  const promiseArray = langUrisObj.map(uri => {
    // console.log(uri.langUri)
    return fetch(uri.langUri, { headers: { 'Authorization': 'token ' + process.env.GITHUB_API_TOKEN } })
      .then(function (response) {
        // console.log(response)
        if (response.ok) {
          return response.text();
        }
        // else
        const error = new Error(response.statusText)
        error.response = response
        throw error

      }).then(function (responseTxt) {
        return JSON.parse(responseTxt)
      });
  });
  return Promise.all(promiseArray)
}

//TODO write the <script> for the index page that gets the username typed in by the user and then write the ajax that inserts their streak info into page (or render a new page)


module.exports = { 
  app, 
  getUserInfo,
  getLangUris, 
  getLangInfo, 
  getApiInfo,
  getApiHeaders,
  parseHeadersLink,
  range,
  getApiInfoUri,
  doAllTheThings,
}