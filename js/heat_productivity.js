// test data
var data = [
  {
    className: 'germany', // optional, can be used for styling
    axes: [
      {axis: "Public administration and defence", value: 13, yOffset: 10},
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
var svg = d3.select('#heat-productivity').append('svg')
    .attr('width', 600)
    .attr('height', 800);

// configuring the radar chart
chart.config({
    w: 320,
    h:320,
    factor: 1,          // scaling for the inner chart
    factorLegend: 1.2,  // relative position for the text labels
    levels: 0,          // number of circles inside the chart
    radius: 5,          // circle radius
});

// draw the radar chart
svg.append('g')
    .classed('focus', 1)
    .attr('transform', 'translate(120,120)')
    .datum(data)
    .call(chart);
