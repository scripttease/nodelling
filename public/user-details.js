//File for d3 graphs code
//see https://bost.ocks.org/mike/bar/
//section coding a chart automatically
// don't forget you need css to see stuff

// if there are already window onload events this js doesn't override them :)
// dont actually need if script at end of body
// if(window.attachEvent) {
//   window.attachEvent('onload', getLangData);
// } else {
//   if(window.onload) {
//       const curronload = window.onload;
//       const newonload = function(evt) {
//           curronload(evt);
//           getLangData(evt);
//       };
//       window.onload = newonload;
//   } else {
//       window.onload = getLangData;
//   }
// }

// to get current url of page: 
// window.location.href
// function userFromUrl() {
//   var url = window.location.href 
//   var regex = /^.*?streak\/(.+)/
//   return regex.exec(url)[1]
// }


function getLangData() {
  const url = window.location.href
  const regex = /^.*?streak\/(.+)/
  const username1 = regex.exec(url)[1]
  // console.log('this is username here ' + username1);
  // console.log(window.location.href);
  return fetch('api/languages', {
    method: "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      username: username1
    })
  })
    .then(res => res.json())
}

function cssValidLangName(lang) {
  const regexAlphaNum = /([a-zA-Z]+)/
  const regexSpace = /\s/
  const regexNonAlphaNum = /\W+/
  const res1 = lang.replace(regexSpace, '')
  const res2 = res1.toLowerCase()
  return res2.replace(regexNonAlphaNum, 'x')
}
// if langdata was in the object passed to the get
// route for this page then could do
// console.log(window.languageData);
// data = window.languageData

getLangData()
  .then(function (data) {
    const elems = document.getElementsByClassName('loader-hide')
    for (var i = 0; i < elems.length; i++) {
      elems[i].style.display = "none";
   }
    // document.getElementById('loader').style.display = 'none'
    // document.getElementById('loader2').style.display = 'none'
    // document.getElementById('loader3').style.display = 'none'
    d3graph(data)
  })

// const data = [{ language: 'SuperCollider', count: 13 },
// { language: 'HCL', count: 144 },
// { language: 'Groovy', count: 298 },
// { language: 'Jupyter Notebook', count: 627 },
// { language: 'CoffeeScript', count: 844 },
// { language: 'Makefile', count: 2056 },
// { language: 'C', count: 3972 },
// { language: 'Processing', count: 10744 },
// { language: 'Elixir', count: 17939 },
// { language: 'Shell', count: 33143 },
// { language: 'Vim script', count: 78029 },
// { language: 'CSS', count: 119758 },
// { language: 'Scala', count: 131638 },
// { language: 'HTML', count: 223061 },
// { language: 'JavaScript', count: 317581 },
// { language: 'Ruby', count: 333298 },//]
// { language: 'Python', count: 6342896 } ]

// svg size
//need margin for axes
function d3graph(data) {
  const margin = 90
  const width = 400
  const height = 400
  //TODO max count!!

  const maxDataCount = data.reduce((prev, curr) => (prev.count > curr.count) ? prev.count : curr.count)
  // scale should crate a fn that takes the datum 
  // val eg 5, divides it by the doain max then 
  // multiples it by the range max
  const scl = d3.scaleLinear()
    // actual data values range
    .domain([0, maxDataCount])
    // range == width on page?
    .range([0, height]);

  // create container with classname chart
  // change this to already having .chart in the html
  // that way can have a place holder 'crunching data' image
  // const svg = d3.select("body").append("svg")
  // this didnt work SO just create a placeholder div and hide it later
  const svg = d3.select("body").append("svg")
    .attr("width", width + 2 * margin)
    .attr("height", height + 2 * margin)
    .attr("class", 'chart')
  // .append("g")


  // bar width in px
  // TODO change this to a fn of the num of langs
  const barWidth = 15
  //space in between bars
  const barSpace = 0.5
  const chartHeight = 400
  //TODO change barwidth if there are too many langs for a whole page width
  const chartWidth = data.length * barWidth + data.length * barSpace

  d3.select('.chart')
    // selectall is like a foreach
    .selectAll('rect')
    // so each data point is selected seperately
    .data(data)
    .enter().append('rect')
    .attr("class", "bar")
    .attr("width", barWidth)
    .attr("id", function (d, i) {return cssValidLangName(d.language) })
    // d === each data obj(elem) in array
    // i is its index
    .attr("x", function (d, i) { return barWidth * i + barSpace * i + margin })
    .attr("y", chartHeight + margin)

    // tooltips must come before transition idk why
    // see http://bl.ocks.org/WilliamQLiu/0aab9d28ab1905ac2c8d
    // .on('mouseover', function (d) { console.log('mouseover' + d.language); })

    .on("mouseover", function (d, i) {  // Create tooltip on mouseover
      const xPosition = barWidth + (i * barWidth)
      const yPosition = chartHeight - scl(d.count) / 2 + 90

      const dlang = cssValidLangName(d.language)
      const langColor = window.langColors[ d.language]['color']
      // Update the tooltip position and value
      // requires addition to html
      d3.select("#tooltip")
        // nb this really depends on what is on page
        //already for the y position!
        .style("left", xPosition + "px")
        .style("top", yPosition + "px")
        .select("#value")
        .text(d.language + ' ' + d.count + ' bytes')

      d3.select("#tooltip").classed("hidden", false)  // Show the tooltip
      d3.select('#' + dlang).style('fill', langColor)
    })
    .on("mouseout", function (d, i) {  // 'Destroy' tooltip on mouseout
      const dlang = cssValidLangName(d.language)
      d3.select("#tooltip").classed("hidden", true);  // Hide the tooltip
      d3.select('#'+ dlang).style('fill', 'rgb(204,204,204)')
    })

    // transition
    //starting height
    .attr("height", 0)
    .transition()
    .delay(function (d, i) { return i * 100; })
    // because starts drawing rect at top
    .attr("y", function (d, i) { return chartHeight + margin - scl(d.count); })
    .attr("height", function (d) { return scl(d.count); })

  function myRange(n) {
    return [...Array(n).keys()];
  }

  const xArray = data.map(d => d.language)
  // scale and axes
  //see http://bl.ocks.org/flunky/1a8b1bb608c06736f1ed4015065cbbb0
  //see https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
  const chart = d3.select(".chart");
  const x = d3.scaleBand()
    // .domain(myRange(data.length))
    .range([0, chartWidth]);
  const y = d3.scaleLinear()
    // .domain([0,333298])
    .range([height, 0]);
  // Scale the range of the data
  x.domain(xArray)
  y.domain([0, d3.max(data, function (d) { return d.count; })]);

  // add axis label
  chart.append("g")
    .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(y));

  // must do appends in correct order
  // see https://bl.ocks.org/d3noob/23e42c8f67210ac6c678db2cd07a747e
  // text title for the x axis
  chart.append("text")
    .attr("transform",
      "translate(" + (width / 2) + " ," +
      (height + margin + 80) + ")")
    .style("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .text("Language");

  chart.append("g")
    .attr("transform", "translate(" + margin + "," + (height + margin) + ")")
    .call(d3.axisBottom(x))
    // rotate axis lables
    // see https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
    .selectAll("text")
    .style("text-anchor", "end")
    .style("font-family", "sans-serif")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // text title for the y axis
  chart.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0)
    .attr("x", 0 - (height / 2) - margin)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-family", "sans-serif")
    .text("Bytes");
}

// d3graph(data)

// colours for hover
// data for loop or for each
// d.language
//add class name to 

