const fetch = require('node-fetch');
const express = require('express');
// secures Express apps by setting various HTTP headers
const helmet = require('helmet');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
// Get the JSON body from requests
const bodyParser = require('body-parser');
const app = express();

const { extractSVG, userStats, langDataSort, } = require('./data-handling')

const { getMainLang, getLangUris, combineLangData, } = require('./github-api');

const GITHUB_API_HOST = 
  process.env.NODE_ENV == "test" 
  ? "http://localhost:7599" 
  : "https://api.github.com"

const GITHUB_HOST = 
  process.env.NODE_ENV == "test" 
  ? "http://localhost:7598" 
  : "https://github.com"

  // console.log(GITHUB_API_HOST);
  // console.log(GITHUB_HOST);


// https://expressjs.com/en/starter/static-files.html
// serve static files from dir 'public'
app.use(express.static('public'))
// set templating engine to ejs
// https://github.com/mde/ejs or https://ejs.co/
app.set('view engine', 'ejs');
app.use(helmet());
app.use(morgan("dev"));
app.use(bodyParser.json())

app.get("/", function (req, res) {
  res.render("index");
});


function getUserInfo(username) {
  // see https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
  // https://scotch.io/tutorials/how-to-use-the-javascript-fetch-api-to-get-data
  return fetch_retry(GITHUB_HOST + "/users/" + username + "/contributions", {
    headers: {
      "Content-Type": "application/json",'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
 
    },
  },3)
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
      // need to make langDataSort available here too
    })
    .catch(error => {
      console.error(error);
      // https://expressjs.com/en/api.html#res.status
      res.status(500).render("error-page");
    });
});


app.post('/streak/api/languages', function (req, res) {
  const username = req.body.username
  getUserLangStats(username)
  // console.log(username)
    .then(userLangStatsObj => {
    // this is ajax
    res.status(200).json(userLangStatsObj)
})
  .catch(error => {
      console.error(error);
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

function fetch_retry(url, options, n) {
  return new Promise(function(resolve, reject) {
      fetch(url, options).then(resolve)
          .catch(function(error) {
              if (n === 1) return reject(error);
              resolve(fetch_retry(url, options, n - 1));
          })
  });
}
// returns: <https://api.github.com/user/6134406/repos?page=2>; rel="next", <https://api.github.com/user/6134406/repos?page=8>; rel="last"
function getPaginationInfoFromHeader(username) {

  return fetch_retry(GITHUB_API_HOST + "/users/" + username + "/repos", {
    headers: {
      "Content-Type": "application/json",'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
 
    }, 
  }, 3).then(function (response) {
    // console.log(response)
    if (response.ok) {
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
// returns:[ 'https://api.github.com/user/6134406/repos?page=1',
  // 'https://api.github.com/user/6134406/repos?page=2',
  // 'https://api.github.com/user/6134406/repos?page=3',...] 
function paginatedUserRepoUris(pagInfoFromHeader) {
  const regex = /(https:\/\/api\.github\.com\/user\/([0-9]+)\/repos\?page\=)([0-9]+)\>; rel\="last"/gm;
  const matches = regex.exec(pagInfoFromHeader);
  const numPages = parseInt(matches[3])
  const array1 = range(numPages)
  const array2 = array1.map(x => x + 1)
  const array3 = array2.map(page => '' + matches[1] + page);
  const res = array3.map(uri => uri.replace("https://api.github.com", GITHUB_API_HOST))
  // console.log(res);
  return res
}

/*
1. Look up how many pages of pagination there are (in headers)
2. Construct pagination URIs from this info
3. make a request to each URI to get repo info
4. make a reques to for each repo to get languages
5. count language stats for all repos together
*/
function getUserLangStats(username) {
  return getPaginationInfoFromHeader(username)
    .then(headerInfo => {
      // console.log(linkHeader);
      const reposUriArray = paginatedUserRepoUris(headerInfo);
      // console.log(reposUriArray);
      const promiseArray = reposUriArray.map(uri => {
        return getLanguageUriForRepo(uri)
      })

      return Promise.all(promiseArray)
    })
    .then(nestedRepoLangArray => {
      const repoLangArray = flattenArray(nestedRepoLangArray);

      return getLangInfo(repoLangArray)
    }).then(langArrayObj => {
      // console.log(langArrayObj);

      return combineLangData(langArrayObj)
      //TODO data formatted for d3
   }).then(combinedLangObj => {
    const sortedD3Data = langDataSort(combinedLangObj)
    // console.log(sortedD3Data);
    return sortedD3Data
   })
}

function flattenArray(arrays) {
  return Array.prototype.concat.apply(...arrays)
}


// takes uri for 1page of repos, returns object containing
// the languages uri for each repo on the page
//TODO IMPORTANT filter for forks - don't want forks clogging up your bytes of code
// filter in the getLangUris?
function getLanguageUriForRepo(uri) {
  const requestUri = uri.replace("https://api.github.com", GITHUB_API_HOST); // Hack for using a proxy in tests
  return fetch_retry(requestUri, { headers: {
      "Content-Type": "application/json", 'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
    },
  },3).then(function (response) {
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

//no longer used
function getApiInfo(username) {
  return fetch_retry(GITHUB_API_HOST + "/users/" + username + "/repos", {
    headers: {
      "Content-Type": "application/json", 'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
    },
  },3).then(function (response) {
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

// takes object containging many language uris
// returns a promise of an array of the resulting
// language object for each repo
function getLangInfo(langUrisObj) {
  const promiseArray = langUrisObj.map(uri => {
  const requestUri = uri.langUri.replace("https://api.github.com", GITHUB_API_HOST); // Hack for using a proxy in tests
    // console.log("the uri is>")
    // console.log(uri.langUri)
    return fetch_retry(requestUri, { headers: { 'Authorization': 'token ' + process.env.GITHUB_API_TOKEN } },3)
      .then(function (response) {
        // console.log(response)
        if (response.ok) {
          return response.text();
        }
        const error = new Error(response.statusText)
        error.response = response
        throw error

      }).then(function (responseTxt) {
        return JSON.parse(responseTxt)
      });
  });
  return Promise.all(promiseArray)
}


//1. get the repo names for all a user repos - do I have this already
//yes I have modified get languris to spit out reponames

//2. construct the uri that goes to this SINGLe Repos commits
//3. from this request get the pagination headers for a single repo
//4. from the paginated uris go to all the commits of the repos. eg gleam has 16!
//5. from the body of these (ie16) pages, parse as JSON then can extract for each commit:
//commit['author']['login'] and if the login is the username ie the user you want, you can then increment a count for the languages 
// BUT to get the languages you actually have to follow the languri 
// OR from each commit body you also follow the commit[url] link and that gives you the actual commitdetails. 
// in commitdetails body under files[] you get each file that was changed and you can work out its languege from the 'filename' extension (this is what git does and its in my colours2.js file
//it also tells you 'additions' which is LINES of code that you changed.





// for an entire org ( ie all the repos) who has commited most lines person (at the moment contributors is by app)
// eg for louis use tokei to calc the TOTAL number of lines of code per language for all his repos
// this would be easier probably to just download the repo rather than querying the api a load of times so maybe write a program that does that .
// what is faster? to clone the entire repo and scrape it OR to do the api queries...
// idea: what is the gateway langauge for code and what languages do ppl progress to if they start with a certain language is there a noticeable divide between functional and oop and if you start with a ceratin lang are you more likely to code more or less, ie corerlation between someones first lang and the number of commits...
//if i do it this way I might want to initially filtr out organisatiions and repos over a certain size but also I should get a user (maybe at randoom) and get all their repos as a staryting point. and from there who they have worked with perhaps although this will mean a skewd data set at first towards a certain lang.
// function getPaginationCommitUris(username) {

//   return fetch_retry("https://api.github.com/users/" + username + "/repos", {
//     headers: {
//       "Content-Type": "application/json",'Authorization': 'token ' + process.env.GITHUB_API_TOKEN 
 
//     }, 
//   }, 3).then(function (response) {
//     // console.log(response)
//     if (response.ok) {
//       // console.log(response.headers);
//       return response.headers.get('link');
//     }
//     // else
//     const error = new Error(response.statusText)
//     error.response = response
//     throw error
//   });
// }

module.exports = { 
  app, 
  getUserInfo,
  getLangUris, 
  getLangInfo, 
  getApiInfo,
  getPaginationInfoFromHeader,
  paginatedUserRepoUris,
  range,
  getLanguageUriForRepo,
  getUserLangStats,
}