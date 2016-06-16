var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = 1140 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var parseDate = d3.time.format("%d-%b-%y").parse;

var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")
		.ticks(6)
		.tickFormat(d3.format("0"));

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

var line = d3.svg.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.annual_mean); });

var area = d3.svg.area()
    .x(function(d) { return x(d.year); })
    .y0(height)
    .y1(function(d) { return y(d.annual_mean); });

var svg = d3.select("#global-temperature").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  	.append("g")
    	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// -----------------------------------------------------------------------------
// define the gradients
var gradient = svg.append("defs")
	  .append("linearGradient")
	    .attr("id", "gradient")
	    .attr("x1", "0%").attr("x2", "0%")
	    .attr("y1", "0%").attr("y2", "100%")
	    .attr("spreadMethod", "pad");
gradient.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#FA5E5E")
	    .attr("stop-opacity", 0.3);
gradient.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#FA5E5E")
	    .attr("stop-opacity", 0.0);

// -----------------------------------------------------------------------------
// import the data
d3.csv("data/global_temperature_data.csv", function(error, data) {
  if (error) throw error;

  x.domain(d3.extent(data, function(d) { return +d.year; }));
  y.domain(d3.extent(data, function(d) { return +d.annual_mean; }));

  svg.append("path")
      .datum(data)
      .attr("class", "global-temperature-area")
      .attr("d", area)
			.style("fill", "url(#gradient)");

	svg.append("path")
	    .datum(data)
	    .attr("class", "global-temperature-line")
	    .attr("d", line);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

  /*svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);*/
});
