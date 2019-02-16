const fetch = require('node-fetch');
const express = require('express');
// secures Express apps by setting various HTTP headers
const helmet = require('helmet');
// HTTP request logger middleware for node.js
const morgan = require('morgan');
const app = express();

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

module.exports = app;
