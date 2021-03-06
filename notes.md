10/2/2019
How did i create the git-streak app? - using express. Express is an external package that contains a basic framework, but what we are using it for you can recreate in node as below, on a low level, and then build your own POST, DELETE and so forth:
[https://medium.freecodecamp.org/a-no-frills-guide-to-node-js-how-to-create-a-node-js-web-app-without-external-packages-a7b480b966d2](https://medium.freecodecamp.org/a-no-frills-guide-to-node-js-how-to-create-a-node-js-web-app-without-external-packages-a7b480b966d2)

### Node Http module:
these guides are good for explaining the node module from simplest guide to most detailed (the docs)
[https://flaviocopes.com/node-module-http/#httpcreateserver](https://flaviocopes.com/node-module-http/#httpcreateserver)
[https://codeburst.io/all-about-http-in-node-js-and-3-best-ways-for-http-requests-in-web-development-6e5b6876c3a4](https://codeburst.io/all-about-http-in-node-js-and-3-best-ways-for-http-requests-in-web-development-6e5b6876c3a4)
[https://nodejs.org/api/http.html](https://nodejs.org/api/http.html)

### Node Express intro
[https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/Introduction)

#### Package json
if you want a package json to handle dependencies you need to run `npm init` in your working dir

#### Installing express 
with a package.json use `npm install express --save`
see [https://expressjs.com/en/starter/installing.html](https://expressjs.com/en/starter/installing.html)

#### installing test framework
[https://hackernoon.com/how-to-run-mocha-chai-unit-tests-on-node-js-apps-832eb2eba590](https://hackernoon.com/how-to-run-mocha-chai-unit-tests-on-node-js-apps-832eb2eba590)

```js
npm install mocha --save
npm install chai --save

```
Create a helper.js file in test/ containing teh following, so you can use `expect` as a keyword/method 
`global.expect = require("chai").expect;`

Create a file called mocha.opts with the following code so that the helper you just created is always required when the test is run

`--require ./test/helper.js`

Create a smaple test in test directory eg:

```js

describe("array", function() {
  it("should have one element", function() {
    var arr = [1];

    expect(arr.length).to.equal(1);
  });
});

```
to run the tests you should just need to do npm test but i have had to change this in package json to this because otherwise it cant find mocha - this isnt supposed to happen but maybe i have a pathe problem.

```json
    "test": "./node_modules/.bin/mocha --watch",
```

#### Testing website pages
[https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai?utm_source=medium&utm_medium=post&utm_campaign=how-to-run-mocha-chai-unit-tests-on-node-js-apps&utm_content=link](https://buddy.works/guides/how-automate-nodejs-unit-tests-with-mocha-chai?utm_source=medium&utm_medium=post&utm_campaign=how-to-run-mocha-chai-unit-tests-on-node-js-apps&utm_content=link)

#### Testing the git-streak data
the api doesn't have streak data so we ended up using the source from this:
"https://github.com/users/" + username + "/contributions" so for example if I use scripttease i get the data in test/user-test-data.html

#### Env variables

In order to authenticate your requests to the github api you will need to generate a personal authentification token (https://github.blog/2013-05-16-personal-api-tokens/)[https://github.blog/2013-05-16-personal-api-tokens/]

Once you have this - to avoid the token being in version control, create a file called .env and copy the format of .env.example but replace "something" with your token.

In order to use your npm start and npm test scripts with an environment variable from your posix compatible shell (ie your terminal) you would now normally need to run: 
```shell
source .env
echo $GITHUB_API_TOKEN
```
to check the environment variable has been set BUT instead, in your package.json you can make sure that the scripts for test and start do this for you, which is done here.

### install d3 for graphs
(https://github.com/d3/d3)[https://github.com/d3/d3]

#AJAX to hit eternal api for lang stats 
1. Add the on load script to d3.js so that the user sees their streak data and that the lang data is being fetched (like in github when it says we are cruching lastest data for you)


## Useful Thinsg
### Node Repl
type `node` into a shell (works if you have it gloabally installed)

### curried with es6

// const add = (x, y) => x + y

// const curriedAdd = x => y => x + y

// function add(x, y) {
//   return x + y
// }

// function curriedAdd(x) {
//   return function(y) {
//     return x + y
//   }
// }
