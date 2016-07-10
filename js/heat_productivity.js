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
    .attr('width', 620)
    .attr('height', 400)
		.append("g")
			.attr('transform', 'translate(103,40)');

// define the gradients
var radarGradientFar = radarChartSvg.append("defs")
	  .append("linearGradient")
			.attr("id", "far-warm-radar-gradient")
	    .attr("x1", "0%").attr("x2", "0%")
	    .attr("y1", "0%").attr("y2", "100%")
	    .attr("spreadMethod", "pad");
radarGradientFar.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#AEFF55")
	    .attr("stop-opacity", 1);
radarGradientFar.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#AEFF55")
	    .attr("stop-opacity", 0.5);

var radarGradientNear = radarChartSvg.append("defs")
	  .append("linearGradient")
			.attr("id", "near-warm-radar-gradient")
	    .attr("x1", "0%").attr("x2", "0%")
	    .attr("y1", "0%").attr("y2", "100%")
	    .attr("spreadMethod", "pad");
radarGradientNear.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#1EEEE0")
	    .attr("stop-opacity", 1);
radarGradientNear.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#1EEEE0")
	    .attr("stop-opacity", 0.5);

var dataRadarChart;
// -----------------------------------------------------------------------------
// load the JSON file and draw the chart
d3.json("data/heat_productivity.json", function (error, data) {
	if (error) return console.error(error);

	// set the global "dataRadarChart" data variable
  dataRadarChart = data;

  setupChart1(data.london);
});

// SETUP RADAR CHART -----------------------------------------------------------
function setupChart1(selectedCityData) {

	// ---------------------------------------------------------------------------
	// create first data array for the radar chart
	var obj = selectedCityData.lossNearWarm;
  var chartData = [];
	var lossNearWarmArray = [];
  var i = 0;
  var axisTitles = dataRadarChart.axisLabels
  for (var key in obj){
    var axisData = {axis: axisTitles[i], value: obj[key]};
    //console.log(axisData);
    lossNearWarmArray.push(axisData);
    i++;
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
  var chartData2 = {className: "Far Future", axes: lossFarWarmArray};
	chartData.push(arrayData, chartData2);

  // call the draw
	updateRadarChart(chartData);
}

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
	radarChartSvg.datum(selectedChartData)
	    .call(chart);
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// AREA CHART ////////////////////////////////////
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

// define the gradients
var gradientFar = svg.append("defs")
	  .append("linearGradient")
			.attr("id", "far-warm-gradient")
	    .attr("x1", "0%").attr("x2", "0%")
	    .attr("y1", "0%").attr("y2", "100%")
	    .attr("spreadMethod", "pad");
gradientFar.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#AEFF55")
	    .attr("stop-opacity", 0.0);
gradientFar.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#AEFF55")
	    .attr("stop-opacity", 0.5);

var gradientFarStroke = svg.append("defs")
	  .append("linearGradient")
			.attr("id", "far-warm-gradient-stroke")
	    .attr("x1", "0%").attr("x2", "0%")
	    .attr("y1", "0%").attr("y2", "100%")
	    .attr("spreadMethod", "pad");
gradientFarStroke.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#AEFF55")
	    .attr("stop-opacity", 0.0);
gradientFarStroke.append("stop")
			.attr("offset", "10%")
			.attr("stop-color", "#AEFF55")
			.attr("stop-opacity", 1.0);
gradientFarStroke.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#AEFF55")
	    .attr("stop-opacity", 1.0);

var gradientNear = svg.append("defs")
	  .append("linearGradient")
			.attr("id", "near-warm-gradient")
	    .attr("x1", "0%").attr("x2", "0%")
	    .attr("y1", "0%").attr("y2", "100%")
	    .attr("spreadMethod", "pad");
gradientNear.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#1EEEE0")
	    .attr("stop-opacity", 0.0);
gradientNear.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#1EEEE0")
	    .attr("stop-opacity", 0.5);

var gradientNearStroke = svg.append("defs")
	  .append("linearGradient")
			.attr("id", "near-warm-gradient-stroke")
	    .attr("x1", "0%").attr("x2", "0%")
	    .attr("y1", "0%").attr("y2", "100%")
	    .attr("spreadMethod", "pad");
gradientNearStroke.append("stop")
	    .attr("offset", "0%")
	    .attr("stop-color", "#1EEEE0")
	    .attr("stop-opacity", 0.0);
gradientNearStroke.append("stop")
	    .attr("offset", "10%")
	    .attr("stop-color", "#1EEEE0")
	    .attr("stop-opacity", 1.0);
gradientNearStroke.append("stop")
	    .attr("offset", "100%")
	    .attr("stop-color", "#1EEEE0")
	    .attr("stop-opacity", 1.0);

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


var dataAreaChart;
var detailLevel = "farWarmFuture";
var selectedCitydataAreaChart;
// -----------------------------------------------------------------------------
// load the JSON file and draw the chart
d3.json("data/adverted_losses.json", function(data) {

	// set the global "dataAreaChart" data variable
  dataAreaChart = data;
  selectedCitydataAreaChart = data.totalLondon;
  setupChart2();

  // CITY SELECTION ------------------------------------------------------------
  d3.select("#nearButton").on("click", function(){
      detailLevel = "nearWarmFuture";
      updateChart();
  });

  d3.select("#farButton").on("click", function(){
      detailLevel = "farWarmFuture";
      updateChart();
  });

  d3.select("#antwerp-dot").on("click", function(){
        selectedCitydataAreaChart = dataAreaChart.totalAntwerp;
        updateChart();
        setupChart1(dataRadarChart.antwerp);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

  d3.select("#bilbao-dot").on("click", function(){
        selectedCitydataAreaChart = dataAreaChart.totalBilbao;
        updateChart();
        setupChart1(dataRadarChart.bilbao);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

  d3.select("#london-dot").on("click", function(){
        selectedCitydataAreaChart = dataAreaChart.totalLondon;
        updateChart();
        setupChart1(dataRadarChart.london);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

});

// SETUP AREA CHART ------------------------------------------------------------
function setupChart2(){

  //var selectedCityData = data.totalLondon;
  selectedCityData = selectedCitydataAreaChart;
  var selectedFuture = 0;

	// selectedCityData.farWarmFuture == selectedCityData[„farWarmFuture“]
	// this allows me to select the far or near future via a string/variable
  xScale.domain( dataAreaChart.categoryNames );
  yScale.domain( [d3.max(selectedCityData[detailLevel], function (d){ return +d; }), 0] );

  // DRAW AXIS -----------------------------------------------------------------
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // DRAW CHART ----------------------------------------------------------------
	var areaChartOffset = 50;
  var area = d3.svg.area()
      .interpolate("cardinal")
      .x(function(d, i) { return xScale(dataAreaChart.categoryNames[i]); })
      .y1(function(d) { return yScale(d); });

  svg.append("path")
        .datum(selectedCityData[detailLevel])
				.attr("class", function(){
					if (detailLevel == "farWarmFuture") {
						return "areaAdvertedLosses farWarm";
					}
					return "areaAdvertedLosses nearWarm";
				})
        .attr("d", area)
				.attr("transform", "translate(" + areaChartOffset + ",0)");

  // Add the scatterplot
    svg.selectAll("dot")
        .data(selectedCityData[detailLevel])
    .enter().append("circle")
        .attr("class", "line-chart-dot")
        .attr("r", 5)
        .attr("cx", function(d, i) { return xScale(dataAreaChart.categoryNames[i]) + areaChartOffset; })
        .attr("cy", function(d) { return yScale(d); })
        .on("mouseover", function(d, i) {
            d3.select(this).classed("hover", true);
            lineChartTooltip.style("opacity", 1);
            console.log((parseInt(d3.select(this).attr("cx"))), (parseInt(d3.select(this).attr("cy"))));
            lineChartTooltip.attr("transform", "translate(" + (parseInt(d3.select(this).attr("cx")) + margin.left + 10) + "," + (parseInt(d3.select(this).attr("cy")) + margin.top - 20) + ")");
            lineChartTooltip.select("text.line-chart-tooltip-h1").text(dataAreaChart.categoryNames[i]);
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
}

// UPDATE AREA CHART -----------------------------------------------------------
function updateChart() {

  // Scale the range of the data again
  xScale.domain( dataAreaChart.categoryNames );
  yScale.domain( [d3.max(selectedCitydataAreaChart[detailLevel], function (d){ return +d; }), 0] );

  // Select the section we want to apply our changes to
  var svg = d3.select("body").transition();

	// crearte the area data string again
  var area = d3.svg.area()
    .interpolate("cardinal")
    .x(function(d, i) { return xScale(dataAreaChart.categoryNames[i]); })
    .y1(function(d) { return yScale(d); });

  svg.selectAll(".referenceLine")
        .duration(updateDuration)
        .attr("y1", function() { return yScale(selectedCitydataAreaChart[detailLevel.replace("Future","Loss")]); })
        .attr("y2", function() { return yScale(selectedCitydataAreaChart[detailLevel.replace("Future","Loss")]); });
  svg.selectAll(".areaAdvertedLosses")
      	.duration(updateDuration)
				.attr("class", function(){
					if (detailLevel == "farWarmFuture") {
						return "areaAdvertedLosses farWarm";
					}
					return "areaAdvertedLosses nearWarm";
				})
        .attr("d", area(selectedCitydataAreaChart[detailLevel]));
	/*svg.selectAll(".line-chart-dot")
      .duration(updateDuration)
	    .data(selectedCityData[detailLevel])
			.enter()
			.attr("cx", function(d, i) { return xScale(dataAreaChart.categoryNames[i]); })
			.attr("cy", function(d) { return yScale(d); })*/
  svg.select(".x.axis")
      .duration(updateDuration)
      .call(xAxis);
  svg.select(".y.axis")
      .duration(updateDuration)
      .call(yAxis);
}
