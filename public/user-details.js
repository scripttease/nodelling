//File for d3 graphs code
//see https://bost.ocks.org/mike/bar/
//section coding a chart automatically
// don't forget you need css to see stuff

// need a bundler like parcel to import 
const data = [{ language: 'SuperCollider', count: 13 },
{ language: 'HCL', count: 144 },
{ language: 'Groovy', count: 298 },
{ language: 'Jupyter Notebook', count: 627 },
{ language: 'CoffeeScript', count: 844 },
{ language: 'Makefile', count: 2056 },
{ language: 'C', count: 3972 },
{ language: 'Processing', count: 10744 },
{ language: 'Elixir', count: 17939 },
{ language: 'Shell', count: 33143 },
{ language: 'Vim script', count: 78029 },
{ language: 'CSS', count: 119758 },
{ language: 'Scala', count: 131638 },
{ language: 'HTML', count: 223061 },
{ language: 'JavaScript', count: 317581 },
{ language: 'Ruby', count: 333298 }]
//{ language: 'Python', count: 6342896 } ]

//TODO max count!!

// scale should crate a fn that takes the datum 
// val eg 5, divides it by the doain max then 
// multiples it by the range max
const scl = d3.scaleLinear()
  // actual data values range
  .domain([0, 333298])
  // range == width on page?
  .range([0, 400])

// svg size
//need margin for axes
const margin = 90
const width = 400
const height = 400
// create container with classname chart
const svg = d3.select("body").append("svg")
  .attr("width", width + 2*margin)
  .attr("height", height + 2*margin)
  .attr("class", 'chart')
// .append("g")


// bar width in px
// TODO change this to a fn of the num of langs
const barWidth = 15
//space in between bars
const barSpace = 0.5
const chartHeight = 400
const chartWidth = data.length*barWidth + data.length*barSpace

d3.select('.chart')
  // selectall is like a foreach
  .selectAll('rect')
  // so each data point is selected seperately
  .data(data)
  .enter().append('rect')
  .attr("class", "bar")
  .attr("width", barWidth)
  // d === each data obj(elem) in array
  // i is its index
  .attr("x", function (d, i) { return barWidth * i + barSpace * i + margin})
  .attr("y", chartHeight + margin)

  // tooltips must come before transition idk why
  // see http://bl.ocks.org/WilliamQLiu/0aab9d28ab1905ac2c8d
  .on('mouseover', function(d) { console.log('mouseover' + d.language); })

  .on("mouseover", function (d, i) {  // Create tooltip on mouseover
    const xPosition = barWidth + (i*barWidth)
    const yPosition = chartHeight - scl(d.count)/2 + 40

    // Update the tooltip position and value
   // requires addition to html
    d3.select("#tooltip")
    // nb this really depends on what is on page
    //already for the y position!
      .style("left", xPosition + "px")
      .style("top", yPosition + "px")
      .select("#value")
      .text(d.language + ' ' + d.count + ' bytes')

    d3.select("#tooltip").classed("hidden", false);  // Show the tooltip
  })
  .on("mouseout", function () {  // 'Destroy' tooltip on mouseout
    d3.select("#tooltip").classed("hidden", true);  // Hide the tooltip
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
    .range([0,chartWidth]);
const y = d3.scaleLinear()
	// .domain([0,333298])
    .range([height,0]);
  // Scale the range of the data
  x.domain(xArray)
  y.domain([0, d3.max(data, function(d) { return d.count; })]);

chart.append("g")
  .attr("transform", "translate(" + margin + "," + margin + ")")
    .call(d3.axisLeft(y));
    
chart.append("g")
  .attr("transform", "translate(" + margin + "," + (height+ margin) + ")")
    .call(d3.axisBottom(x))
    // rotate axis lables
    // see https://bl.ocks.org/d3noob/3c040800ff6457717cca586ae9547dbf
    .selectAll("text")	
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

// // Create Text Labels
// svg.selectAll("text")
//   .data(dataset)
//   .enter()
//   .append("text")
//   .text(function (d) {
//     return d; // Value in array is the text
//   })
//   .attr("x", function (d, i) {
//     return xScale(i) + xScale.rangeBand() / 2;
//   })
//   .attr("y", function (d) {
//     return canvas_height - yScale(d) + 15;
//   })
//   .attr("font-family", "sans-serif") // Change text font
//   .attr("font-size", "14px") // Font size
//   .attr("text-anchor", "middle") // Align to middle
//   .attr("fill", "white");  // Color of font

//             // Do something on text click


// // 