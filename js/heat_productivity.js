// BASIC VARIABLES -------------------------------------------------------------
var updateDuration = 750;
var dataNumberFactor = 1000000;
var dataFormat = d3.format(",");
var futureSwitchBool = 1;
var barChartBarOffset = 80;

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
			.attr('transform', 'translate(120,40)');

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
    if (key != "total") {
			var axisData = {axis: axisTitles[i], value: obj[key]};
	    lossNearWarmArray.push(axisData);
	    i++;
    }
  }

  // create second data array
  var obj2 = selectedCityData.lossFarWarm;
  var chartData2 = [];
	var lossFarWarmArray = [];
  for (var key in obj2){
		if (key != "total") {
	    var axisData = {axis: key, value: obj2[key]};
	    lossFarWarmArray.push(axisData);
		}
  }

  // move the two data arrays into one
  var arrayData = {className: "Near Future", axes: lossNearWarmArray};
  var chartData2 = {className: "Far Future", axes: lossFarWarmArray};
	chartData.push(arrayData, chartData2);

  // call the draw
	updateRadarChart(chartData);

	// update the legend labels
	d3.select("#nearWarm-radar-label").html("Near Future Total: " + selectedCityData.lossNearWarm.total + "m €");
	d3.select("#farWarm-radar-label").html("Far Future Total: " + selectedCityData.lossFarWarm.total + "m €");
}

// draw the radar chart
function updateRadarChart(selectedChartData) {
	// configuring the attributes
	chart.config({
	    w: 320,
	    h:320,
	    factor: 1,          // scaling for the inner chart
	    factorLegend: 1.2,  // relative position for the text labels
	    levels: 5,          // number of circles inside the chart
	    radius: 5,          // circle radius
			tooltipFormatValue: function(d) {
		    return dataFormat(d*dataNumberFactor) + "€";
		  }
	});

	// drawing
	radarChartSvg.datum(selectedChartData)
	    .call(chart);
}

////////////////////////////////////////////////////////////////////////////////
//////////////////////////////// AREA CHART ////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

// basic setup of the SVG
var margin = {top: 20, right: 0, bottom: 80, left: 70},
    width = 1100 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

var svg = d3.select('#line-chart').append('svg').attr("id", "line-chart-svg")
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// -----------------------------------------------------------------------------
// preapare the chart axis
var xScale = d3.scale.ordinal()
              .rangeRoundBands([0, width+barChartBarOffset], 0.7); //this creates rounded pixel values and includes a 10% (0.1) margin between the bars

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
            .tickFormat(function(d){
							if (d == 0) {
								return "0";
							}
							return dataFormat(d) + "m €";
						})
            .ticks(10);


var dataAreaChart;
var detailLevel = "farWarmFuture";
var selectedCitydataAreaChart;
var city = "London";
// -----------------------------------------------------------------------------
// load the JSON file and draw the chart
d3.json("data/adverted_losses.json", function(data) {

	// set the global "dataAreaChart" data variable
  dataAreaChart = data;
  selectedCitydataAreaChart = data.totalLondon;
  setupChart2();

  // CITY SELECTION ------------------------------------------------------------

  d3.select("#antwerp-dot").on("click", function(){
        selectedCitydataAreaChart = dataAreaChart.totalAntwerp;
				city = "Antwerp";
        updateChart();
        setupChart1(dataRadarChart.antwerp);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

  d3.select("#bilbao-dot").on("click", function(){
        selectedCitydataAreaChart = dataAreaChart.totalBilbao;
				city = "Bilbao";
        updateChart();
        setupChart1(dataRadarChart.bilbao);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

  d3.select("#london-dot").on("click", function(){
        selectedCitydataAreaChart = dataAreaChart.totalLondon;
				city = "London";
        updateChart();
        setupChart1(dataRadarChart.london);
        d3.select(".active-dot").attr("class", "");
        d3.select(this).attr("class", "active-dot");
  });

});

// SETUP AREA CHART ------------------------------------------------------------
function setupChart2(){

  var selectedFuture = 0;

	// selectedCitydataAreaChart.farWarmFuture == selectedCitydataAreaChart[„farWarmFuture“]
	// this allows me to select the far or near future via a string/variable
  xScale.domain( dataAreaChart.categoryNames );
  yScale.domain( [d3.max(selectedCitydataAreaChart["nearWarmFuture"], function (d){ return +d*1.1; }), 0] );

  // DRAW AXIS -----------------------------------------------------------------
  svg.append("g")
      .attr("class", "x axis")
      .call(xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis);

  // DRAW CHART ----------------------------------------------------------------
	var barChart = svg.selectAll(".bar")
				.data(selectedCitydataAreaChart[detailLevel])
				.enter()
				.append("rect")
				.attr("class", function(){
					if (detailLevel == "farWarmFuture") {
						return "bar areaAdvertedLosses farWarm";
					}
					return "bar areaAdvertedLosses nearWarm";
				})
				.attr("x", function(d, i) { return (xScale(dataAreaChart.categoryNames[i]) - (barChartBarOffset/2)); })
				.attr("y", 0)
				.attr("width", xScale.rangeBand())
				.attr("height", function(d) { return yScale(d); })
				.on("mouseover", function(d, i) {
            d3.select(this).classed("hover", true);
            lineChartTooltip.style("opacity", 1);
            lineChartTooltip.attr("transform", "translate(" + (parseInt(d3.select(this).attr("x")) + (parseInt(d3.select(this).attr("width"))/2) + margin.left - 77.5) + "," + (parseInt(d3.select(this).attr("height")) + margin.top + 5) + ")");
            lineChartTooltip.select("text.line-chart-tooltip-h1").text(dataAreaChart.categoryNames[i]);
            lineChartTooltip.select("text.line-chart-tooltip-text").text(function() {
              if (detailLevel == "farWarmFuture") {
                  return "Far Warm Future:";
              }
              return "Near Warm Future:"
            });
            lineChartTooltip.select("text.line-chart-tooltip-text2").text(dataFormat(selectedCitydataAreaChart[detailLevel][i]*dataNumberFactor) + "€");
        })
        .on("mouseout", function(d) {
            d3.select(this).classed("hover", false);
            lineChartTooltip.style("opacity", 0).attr("transform", "translate(0,0)");
        });

  // create reference line
  svg.append("line")
        .attr("class", "referenceLine")
        .attr("x1", 0)
        .attr("y1", function() { return yScale(selectedCitydataAreaChart.farWarmLoss); })
        .attr("x2", width)
        .attr("y2", function() { return yScale(selectedCitydataAreaChart.farWarmLoss); })
        .attr("stroke-width", 2)
        .attr("stroke", "#FA5E5E");


	// LEGEND --------------------------------------------------------------------
  svg.append("g")
        .attr("class", "area-chart-legend")
        .attr("transform", function(d) { return "translate(" + (width-120) + "," + (height-88) + ")"; })
        .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 120)
          .attr("height", 88+10) // +10 to hide the selection line behind
          .attr("fill", "#362A35");

  svg.select(".area-chart-legend")
        .append("text")
        .text("Loss per Sector")
        .attr("x", 11)
        .attr("y", 15)
        .style("font-weight", "600");

  svg.select(".area-chart-legend")
        .append("rect")
          .attr("x", 17)
          .attr("y", 27)
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", "url(#far-warm-radar-gradient)");

  svg.select(".area-chart-legend")
        .append("text")
        .text("Far Future")
        .attr("x", 34)
        .attr("y", 36);

  svg.select(".area-chart-legend")
        .append("rect")
          .attr("x", 17)
          .attr("y", 47)
          .attr("width", 10)
          .attr("height", 10)
          .attr("fill", "url(#near-warm-radar-gradient)");

  svg.select(".area-chart-legend")
        .append("text")
        .text("Near Future")
        .attr("x", 34)
        .attr("y", 57);

  svg.select(".area-chart-legend")
        .append("line")
          .attr("x1", 16)
          .attr("y1", 74)
          .attr("x2", 28)
          .attr("y2", 74)
          .attr("stroke-width", 2)
          .attr("stroke", "#FA5E5E");

  svg.select(".area-chart-legend")
        .append("text")
        .text("No Adaptation")
        .attr("x", 34)
        .attr("y", 78);

  // FUTURE SWITCH -------------------------------------------------------------
  var futureSwitch = d3.select("#line-chart-svg").append("g")
        .attr("class", "future-switch")
        .attr("transform", function(d) { return "translate(" + (width-140) + "," + (height + margin.top + 40) + ")"; });

  futureSwitch.append("text")
        .text("Near Future")
				.attr("font-size", 12);

  futureSwitch.append("g")
        .attr("transform", "translate(85, -14)")
        .on("click", function(d){
          if (futureSwitchBool == 0) {
            detailLevel = "farWarmFuture";
            updateChart();
            d3.select(this).select("circle").transition().duration(200).attr("cx", 30);
            futureSwitchBool++;
          }else {
            detailLevel = "nearWarmFuture";
            updateChart();
            d3.select(this).select("circle").transition().duration(200).attr("cx", 10);
            futureSwitchBool--;
          }
        })
        .append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 40)
          .attr("height", 20)
          .attr("rx", 10)
          .attr("ry", 10)
          .attr("stroke", "#fff")
          .attr("stroke-width", 2)
          .attr("fill", "#362A35");

  futureSwitch.select("g")
        .append("circle")
        .attr("cx", 30)
        .attr("cy", 10)
        .attr("r", 7);

  futureSwitch.append("text")
        .text("Far Future")
				.attr("font-size", 12)
        .attr("x", 140);


	// TOOLTIP -------------------------------------------------------------------
  var lineChartTooltip = d3.select("#line-chart-svg").append("g")
        .attr("class", "tooltip")
        .style("opacity", 0);

  lineChartTooltip.append("rect")
        .attr("width", 10)
        .attr("height", 10)
        .attr("transform", "rotate(45)")
        .attr("x", "55")
        .attr("y", "-55")
        .attr("fill", "white");

  lineChartTooltip.append("rect")
        .attr("width", 155)
        .attr("height", 80)
        .attr("x", "0")
        .attr("y", "6")
        .attr("rx", 5)
        .attr("ry", 5)
        .attr("fill", "white");

  lineChartTooltip.append("text")
        .attr("class", "line-chart-tooltip-h1")
        .text("Section Name")
        .attr("fill", "black")
        .attr("x", "9")
        .attr("y", "28");

  lineChartTooltip.append("text")
        .attr("class", "line-chart-tooltip-text")
        .text("Section Name")
        .attr("fill", "black")
        .attr("x", "9")
        .attr("y", "53");

  lineChartTooltip.append("text")
        .attr("class", "line-chart-tooltip-text2")
        .text("Section Value")
        .attr("fill", "black")
        .attr("x", "9")
        .attr("y", "71");
}

// UPDATE AREA CHART -----------------------------------------------------------
function updateChart() {

  // Scale the range of the data again
	if (city == "London") {
		yScale.domain( [d3.max(selectedCitydataAreaChart["nearWarmFuture"], function (d){ return +d*1.1; }), 0] );
	}else {
		yScale.domain( [d3.max(selectedCitydataAreaChart["farWarmFuture"], function (d){ return +d*1.1; }), 0] );
	}


  // Select the section we want to apply our changes to
  var svg = d3.select("body").transition();

	// draw the bar chart again
	d3.selectAll(".bar")
			.data(selectedCitydataAreaChart[detailLevel])
			.transition()
			.duration(updateDuration)
			.attr("class", function(){
				if (detailLevel == "farWarmFuture") {
					return "bar areaAdvertedLosses farWarm";
				}
				return "bar areaAdvertedLosses nearWarm";
			})
			.attr("height", function(d) { return yScale(d); });

	svg.selectAll(".referenceLine")
	        .duration(updateDuration)
	        .attr("y1", function() { return yScale(selectedCitydataAreaChart[detailLevel.replace("Future","Loss")]); })
	        .attr("y2", function() { return yScale(selectedCitydataAreaChart[detailLevel.replace("Future","Loss")]); });

  svg.select(".y.axis")
      .duration(updateDuration)
      .call(yAxis);
}
