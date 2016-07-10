// BASIC VARIABLES -------------------------------------------------------------
var updateDuration = 750;

// IMPORT EXTERNAL SVG ---------------------------------------------------------
// little map selection
d3.xml("graphics/map-selection.svg").mimeType("image/svg+xml").get(function(error, xml) {
  if (error) throw error;
  document.getElementById("map-selection").appendChild(xml.documentElement);
});

// detail on top of area chart
d3.xml("graphics/line-chart-selection.svg").mimeType("image/svg+xml").get(function(error, xml) {
  if (error) throw error;
  document.getElementById("line-chart-selection").appendChild(xml.documentElement);
});

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// RADAR CHART ///////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// basic setup of the SVG
var chart = RadarChart.chart();
var chartData = [];
var radarChartSvg = d3.select('#radar-chart').append('svg')
    .attr('width', 600)
    .attr('height', 400);

// -----------------------------------------------------------------------------
// load the JSON file and draw the chart
d3.json("data/heat_productivity.json", function (error, data) {
	if (error) return console.error(error);

	// prepare the data
	var selectedCityData = data.london;

	// ---------------------------------------------------------------------------
	// create first data array for the radar chart
	var obj = selectedCityData.lossNearWarm;
  var chartData = [];
	var lossNearWarmArray = [];
  for (var key in obj){
    var axisData = {axis: key, value: obj[key]};
    //console.log(axisData);
    lossNearWarmArray.push(axisData);
  }

  // create second data array
  var obj2 = selectedCityData.lossFarWarm;
  var chartData2 = [];
	var lossFarWarmArray = [];
  for (var key in obj2){
    var axisData = {axis: key, value: obj2[key]};
    lossFarWarmArray.push(axisData);
  }

  // move the two data arrays into one
  var arrayData = {className: "Near Future", axes: lossNearWarmArray};
  var arrayData2 = {className: "Far Future", axes: lossFarWarmArray};
	chartData.push(arrayData, arrayData2);

  // call the draw
	updateRadarChart(chartData);
});

// draw the radar chart
function updateRadarChart(selectedChartData) {
	// configuring the attributes
	chart.config({
	    w: 320,
	    h:320,
	    factor: 1,          // scaling for the inner chart
	    factorLegend: 1.2,  // relative position for the text labels
	    levels: 0,          // number of circles inside the chart
	    radius: 5,          // circle radius
	});

	// drawing
	radarChartSvg.append('g')
	    .classed('focus', 1)
	    .attr('transform', 'translate(120,40)')
	    .datum(selectedChartData)
	    .call(chart);
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// LINE CHART ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// basic setup of the SVG
var margin = {top: 20, right: 5, bottom: 30, left: 45},
    width = 1100 - margin.left - margin.right,
    height = 300 - margin.top - margin.bottom;

var svg = d3.select('#line-chart').append('svg').attr("id", "line-chart-svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// -----------------------------------------------------------------------------
// preapare the chart axis
var xScale = d3.scale.ordinal()
              .rangeRoundBands([0, width], 0.1); //this creates rounded pixel values and includes a 10% (0.1) margin between the bars

var yScale = d3.scale.linear()
              .range([height, 0]);

var xAxis = d3.svg.axis()
            .scale(xScale)
            .orient("top")
            .innerTickSize(0)
            .outerTickSize(0)
            .tickFormat("");

var yAxis = d3.svg.axis()
            .scale(yScale)
            .orient("left")
            .innerTickSize(-width)
            .tickFormat(d3.format(","))
            .ticks(10);

// -----------------------------------------------------------------------------
// load the JSON file and draw the chart
d3.json("data/adverted_losses.json", function(data) {

  var selectedCityData = data.totalLondon;
  var selectedFuture = 0;
  var selectedFutureArray = ["nearWarmFuture", "farWarmFuture"];

  xScale.domain( data.categoryNames );
  yScale.domain( [d3.max(selectedCityData.farWarmFuture, function (d){ return +d; }), 0] );

  // DRAW AXIS -----------------------------------------------------------------
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // DRAW CHART ----------------------------------------------------------------
  var area = d3.svg.area()
      .interpolate("cardinal")
      .x(function(d, i) { return xScale(data.categoryNames[i]); })
      .y1(function(d) { return yScale(d); });

  svg.append("path")
        .datum(selectedCityData.farWarmFuture)
        .attr("class", "areaFar")
        .attr("d", area);

  // Add the scatterplot
    svg.selectAll("dot")
        .data(selectedCityData.farWarmFuture)
    .enter().append("circle")
        .attr("class", "line-chart-dot")
        .attr("r", 5)
        .attr("cx", function(d, i) { return xScale(data.categoryNames[i]); })
        .attr("cy", function(d) { return yScale(d); })
        .on("mouseover", function(d, i) {
            d3.select(this).classed("hover", true);
            lineChartTooltip.style("opacity", 1);
            console.log((parseInt(d3.select(this).attr("cx"))), (parseInt(d3.select(this).attr("cy"))));
            lineChartTooltip.attr("transform", "translate(" + (parseInt(d3.select(this).attr("cx")) + margin.left + 10) + "," + (parseInt(d3.select(this).attr("cy")) + margin.top - 20) + ")");
            lineChartTooltip.select("text.line-chart-tooltip-h1").text(data.categoryNames[i]);
            lineChartTooltip.select("text.line-chart-tooltip-text").text(d + " mio. €");
        })
        .on("mouseout", function(d) {
            d3.select(this).classed("hover", false);
            lineChartTooltip.style("opacity", 0).attr("transform", "translate(0,0)");
        });

  // create reference line
  svg.append("line")
        .attr("class", "referenceLine")
        .attr("x1", 0)
        .attr("y1", function() { return yScale(selectedCityData.farWarmLoss); })
        .attr("x2", width)
        .attr("y2", function() { return yScale(selectedCityData.farWarmLoss); })
        .attr("stroke-width", 2)
        .attr("stroke", "#FA5E5E");

  // Define the div for the tooltip
  var lineChartTooltip = d3.select("#line-chart-svg").append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

  lineChartTooltip.append("rect")
        .attr("width", 100)
        .attr("height", 50)
        .attr("x", "10")
        .attr("y", "0")
        .attr("fill", "white");

  lineChartTooltip.append("text")
        .attr("class", "line-chart-tooltip-h1")
        .text("Section Name")
        .attr("fill", "black")
        .attr("x", "20")
        .attr("y", "20");

  lineChartTooltip.append("text")
        .attr("class", "line-chart-tooltip-text")
        .text("Section Name")
        .attr("fill", "black")
        .attr("x", "20")
        .attr("y", "40");


  // UPDATE CHART --------------------------------------------------------------
  function updateChart(data) {



    // Scale the range of the data again
    xScale.domain( data.categoryNames );
    yScale.domain( [d3.max(selectedCityData.farWarmFuture, function (d){ return +d; }), 0] );

    // Select the section we want to apply our changes to
    var svg = d3.select("body").transition();

    svg.selectAll(".referenceLine")
          .duration(updateDuration)
          .attr("y1", function() { return yScale(selectedCityData.nearWarmLoss); })
          .attr("y2", function() { return yScale(selectedCityData.nearWarmLoss); });
    /*svg.selectAll(".areaNear")
          .duration(750)
          .datum(selectedCityData.farWarmFuture)
          .attr("d", area);*/
    svg.select(".x.axis")
        .duration(updateDuration)
        .call(xAxis);
    svg.select(".y.axis")
        .duration(updateDuration)
        .call(yAxis);
  }

  // CITY SELECTION ------------------------------------------------------------
  d3.select("#nearButton").on("click", function(){
          updateChart(data);
  });

  d3.select("#antwerp-dot").on("click", function(){
        selectedCityData = data.totalAntwerp;
        updateChart(data);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

  d3.select("#bilbao-dot").on("click", function(){
        selectedCityData = data.totalBilbao;
        updateChart(data);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

  d3.select("#london-dot").on("click", function(){
        selectedCityData = data.totalLondon;
        updateChart(data);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });
});
