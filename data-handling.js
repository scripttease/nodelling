function dataHandling(json) {
  var txt = JSON.parse(json)
  var stng = txt.toString()


  return stng.split("\n");
}

module.exports = dataHandling;
