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

// scale should crate a fn that takes the datum 
// val eg 5, divides it by the doain max then 
// multiples it by the range max
const scl = d3.scaleLinear()
  // actual data values range
  .domain([0, 333298])
  // range == width on page?
  .range([0, 400])

// svg size
const width = 400
const height = 400
// create container with classname chart
const svg = d3.select("body").append("svg")
  .attr("width", width)
  .attr("height", height)
  .attr("class", 'chart')
  .append("g")


// bar width in px
// TODO change this to a fn of the num of langs
const barWidth = 15
//space in between bars
const barSpace = 0.5
const chartHeight = 400

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
  .attr("x", function (d, i) { return barWidth * i + barSpace * i; })
  .attr("y", chartHeight)
  // starting height
  .attr("height", 0)
  .transition()
  .delay(function (d, i) { return i * 100; })
  .attr("y", function (d, i) { return chartHeight - scl(d.count); })
  .attr("height", function (d) { return scl(d.count); })


