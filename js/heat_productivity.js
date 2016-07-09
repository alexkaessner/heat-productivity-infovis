// test data
var testdata = [
  {
    className: 'germany', // optional, can be used for styling
    axes: [
      {axis: "Public administration and defence", value: 13.4, yOffset: 10},
      {axis: "Agriculture, forestry and fishing", value: 6},
      {axis: "Other Industry", value: 5},
      {axis: "Manufacturing", value: 9},
      {axis: "Construction", value: 8},
      {axis: "Information and communication", value: 7},
      {axis: "Wholesale and retail trade", value: 3},
      {axis: "Financial and insurance activities", value: 2, xOffset: -20}
    ]
  },
  {
    className: 'argentina',
    axes: [
      {axis: "Public administration and defence", value: 6},
      {axis: "Agriculture, forestry and fishing", value: 7},
      {axis: "Other Industry", value: 10},
      {axis: "Manufacturing", value: 13},
      {axis: "Construction", value: 9},
      {axis: "Information and communication", value: 4},
      {axis: "Wholesale and retail trade", value: 6},
      {axis: "Financial and insurance activities", value: 8}
    ]
  }
];

// Basic setup of the SVG
var chart = RadarChart.chart();
var chartData = [];
var svg = d3.select('#heat-productivity').append('svg')
    .attr('width', 600)
    .attr('height', 800);

// -----------------------------------------------------------------------------
// load the JSON file and draw the charts
d3.json("data/heat_productivity.json", function (error, data) {
	if (error) return console.error(error);

	// prepare the data
	var selectedCityData = data.london;

	//console.log(selectedCityData);

	// RADAR CHART ---------------------------------------------------------------
	// create data array for the radar chart
	var obj = selectedCityData.lossNearWarm;
  var chartData = [];
	var lossNearWarmArray = [];
  for (var key in obj){
    var axisData = {axis: key, value: obj[key]};
    //console.log(axisData);
    lossNearWarmArray.push(axisData);
  }

  var obj2 = selectedCityData.lossFarWarm;
  var chartData2 = [];
	var lossFarWarmArray = [];
  for (var key in obj2){
    var axisData = {axis: key, value: obj2[key]};
    //console.log(axisData);
    lossFarWarmArray.push(axisData);
  }
  var arrayData = {className: "Near Future", axes: lossNearWarmArray};
  var arrayData2 = {className: "Far Future", axes: lossFarWarmArray};
	chartData.push(arrayData, arrayData2);

	console.log(chartData);

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
	svg.append('g')
	    .classed('focus', 1)
	    .attr('transform', 'translate(120,120)')
	    .datum(selectedChartData)
	    .call(chart);
}
