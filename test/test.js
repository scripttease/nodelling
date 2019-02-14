var fs  = require('fs');
// var fileName = './user-test-data.txt'
var chai = require('chai');
var server = require('../server');
var dataHandling = require('../data-handling');
// var testData = require('./user-test-data.txt');
var should = chai.should();

// TODO how could i use const here when I want the data available elsewhere in scope?
// before(function(done){

describe("dataHandling", function() {

  before(function(done){
    // Reads test file and converts to JSON so that it will have same format as the data I request
    //TODO make this relative
    fs.readFile('/Users/al/projects/nodelling/test/user-test-data.txt', 'utf8', function(err, fileContents,) {
      if (err) throw(err);

      var data = JSON.stringify(fileContents);
      // console.log(fileContents);
      done()
      return data;
    })
    return data;
  });

  it("should convert json to string", function() {
    var stringOut = dataHandling(data);

    // console.log(data);
    expect(stringOut.charAt(1)).to.equal('<')
  });

  it('should split data into array of lines', function() {
    var stringOut = dataHandling(data);
    console.log(stringOut);
    expect(stringOut.length).to.equal(577);
  });

});
