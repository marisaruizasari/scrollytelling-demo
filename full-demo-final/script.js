
// Scrollama sticky side example https://github.com/russellgoldenberg/scrollama/blob/master/docs/sticky-side/index.html


// 1. initialize the scrollama
var scroller = scrollama();

function init() {

  scroller
    .setup({
      step: "#scrolly article .step",
      offset: 0.5,
    //   debug: true
    })
    .onStepEnter(handleStepEnter);

}


// 2. scrollama event handlers
function handleStepEnter(response) {
  
  // response = { element, direction, index }
  console.log(response);

  // get the data step attribute which has our "stacked, grouped, or percent value"
  var chartType = response.element.getAttribute("data-step")
  changeChart(chartType)

}

// kick things off
init();



// create a function to change our chart depending on the value we pass it
function changeChart(value) {

  if (value === "grouped") transitionGrouped();
  else if (value === "stacked") transitionStacked();
  else if (value === "percent") transitionPercent();
  
  }


// D3 transitions example https://bl.ocks.org/lorenzopub/352ad2e6f577c4abf55e29e6d422535a

var n = 4, // number of layers
m = 58, // number of samples per layer
stack = d3.stack(),
data = d3.range(n).map(function() { return bumpLayer(m, .1); });

var formatPercent = d3.format(".0%");
var formatNumber = d3.format("");

// transpose data
data = data[0].map(function(col, i) { 
return data.map(function(row) { 
    return row[i] 
})
});

var layers = stack.keys(d3.range(n))(data),
yStackMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d[1]; }); }),
yGroupMax = d3.max(layers, function(layer) { return d3.max(layer, function(d) { return d[1] - d[0]; }); });

var margin = {top: 40, right: 10, bottom: 20, left: 35},
width = 960 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;

var x = d3.scaleBand()
.domain(d3.range(m))
.rangeRound([0, width])
.padding(0.1)
.align(0.1);

var y = d3.scaleLinear()
.domain([0, yStackMax])
.rangeRound([height, 0]);

var color = d3.scaleLinear()
.domain([0, n - 1])
.range(["#aad", "#556"]);

var xAxis = d3.axisBottom()
.scale(x)
.tickSize(0)
.tickPadding(6);

var yAxis = d3.axisLeft()
.scale(y)
.tickSize(2)
.tickPadding(6);

// change select to your graphic div where you want the chart to go
var svg = d3.select("figure").append("svg")
.attr("width", width + margin.left + margin.right)
.attr("height", height + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var layer = svg.selectAll(".layer")
.data(layers)
.enter().append("g")
.attr("class", "layer")
.attr("id", function(d) { return d.key; })
.style("fill", function(d, i) { return color(i); });

var rect = layer.selectAll("rect")
.data(function(d) { return d; })
.enter().append("rect")
.attr("x", function(d, i) { return x(i); })
.attr("y", height)
.attr("width", x.bandwidth())
.attr("height", 0);

rect.transition()
.delay(function(d, i) {return i * 10; })
.attr("y", function(d) { return y(d[1]); })
.attr("height", function(d) { return y(d[0]) - y(d[1]); });

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + height + ")")
.call(xAxis);

svg.append("g")
.attr("class", "y axis")
.attr("transform", "translate(" + 0 + ",0)")
.style("font-size", "10px")
.call(yAxis);

function transitionGrouped() {
y.domain([0, yGroupMax]);

rect.transition()
    .duration(500)
    .delay(function(d, i) { return i * 10; })
    .attr("x", function(d, i, j) { return x(i) + x.bandwidth() / n * parseInt(this.parentNode.id); })
    .attr("width", x.bandwidth() / n)
.transition()
    .attr("y", function(d) { return height - (y(d[0]) - y(d[1])); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); });

yAxis.tickFormat(formatNumber)
svg.selectAll(".y.axis").transition()
    .delay(500)
    .duration(500)
    .call(yAxis)
}

function transitionStacked() {
y.domain([0, yStackMax]);

rect.transition()
    .duration(500)
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { return y(d[1]); })
    .attr("height", function(d) { return y(d[0]) - y(d[1]); })
.transition()
    .attr("x", function(d, i) { return x(i); })
    .attr("width", x.bandwidth());

yAxis.tickFormat(formatNumber)
svg.selectAll(".y.axis").transition()
    .delay(500)
    .duration(500)
    .call(yAxis)

}

function transitionPercent() {
y.domain([0, 1]);

rect.transition()
    .duration(500)
    .delay(function(d, i) { return i * 10; })
    .attr("y", function(d) { 
        var total = d3.sum(d3.values(d.data)); 
        return y(d[1] / total); })
    .attr("height", function(d) { 
        var total = d3.sum(d3.values(d.data));
        return y(d[0] / total) - y(d[1] / total); })
.transition()
    .attr("x", function(d, i) { return x(i); })
    .attr("width", x.bandwidth());

yAxis.tickFormat(formatPercent)

svg.selectAll(".y.axis").transition()
    .delay(500)
    .duration(500)
    .call(yAxis)

}

// Inspired by Lee Byron's test data generator.
function bumpLayer(n, o) {

function bump(a) {
var x = 1 / (.1 + Math.random()),
    y = 2 * Math.random() - .5,
    z = 10 / (.1 + Math.random());
for (var i = 0; i < n; i++) {
  var w = (i / n - y) * z;
  a[i] += x * Math.exp(-w * w);
}
}

var a = [], i;
for (i = 0; i < n; ++i) a[i] = o + o * Math.random();
for (i = 0; i < 5; ++i) bump(a);

return a.map(function(d, i) { return Math.max(0, d); });
}

