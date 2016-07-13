// IMPORT EXTERNAL SVG ---------------------------------------------------------
// little map selection
d3.xml("graphics/dotted-worldmap.svg").mimeType("image/svg+xml").get(function(error, xml) {
  if (error) throw error;
  document.getElementById("dotted-world-map").appendChild(xml.documentElement);
});

// BASIC VARIABLES -------------------------------------------------------------
var cityNames = ["New York", "London", "Mumbai", "Shanghai", "Rio de Janairo", "Johannesburg", "sydney"];
var cityLocations = [[27, 21], [60, 14], [93, 31], [113, 24], [40, 51], [72, 54], [128, 56]];
var mapScaling = 8;
var populationFactor = 1000000; // Million
var populationScaling = 2.3;
var populationFormat = d3.format(".3s")

// -----------------------------------------------------------------------------
// load the JSON file and draw the circles
d3.json("data/urbanisation.json", function(error, data){
	if (error) return console.error(error);

	// basic setup of the SVG
	var svg = d3.select('#dotted-world-map').insert('svg', ":first-child")
	    .attr('width', 1140)
	    .attr('height', 542)
			.style("position", "absolute");

	var circleGroup = svg.selectAll("g")
			.data(data)
			.enter()
			.append("g");

	circleGroup.append("circle")
				.attr("class", "y2030")
				.attr("cx", function(d){ return (d.location[0] * mapScaling); })
				.attr("cy", function(d){ return (d.location[1] * mapScaling); })
				.attr("r", function(d){ return ((d.y2030 / populationFactor) * populationScaling); })
				.on("mouseover", function(d, i){
					d3.select("#id"+i).text("population 2030: " + populationFormat(d.y2030));
				})
				.on("mouseout", function(d, i){
					d3.select("#id"+i).text(d.name);
				});
	circleGroup.append("circle")
				.attr("class", "y1990")
				.attr("cx", function(d){ return (d.location[0] * mapScaling); })
				.attr("cy", function(d){ return (d.location[1] * mapScaling); })
				.attr("r", function(d){ return ((d.y1990 / populationFactor) * populationScaling); })
				.on("mouseover", function(d, i){
					d3.select("#id"+i).text("population 1990: " + populationFormat(d.y1990));
				})
				.on("mouseout", function(d, i){
					d3.select("#id"+i).text(d.name);
				});

	circleGroup.append("circle")
				.attr("class", "y1950")
				.attr("cx", function(d){ return (d.location[0] * mapScaling); })
				.attr("cy", function(d){ return (d.location[1] * mapScaling); })
				.attr("r", function(d){ return ((d.y1950 / populationFactor) * populationScaling); })
				.on("mouseover", function(d, i){
					d3.select("#id"+i).text("population 1950: " + populationFormat(d.y1950));
				})
				.on("mouseout", function(d, i){
					d3.select("#id"+i).text(d.name);
				});

	circleGroup.append("text")
				.text(function(d){ return d.name })
				.attr("id", function(d, i){ return "id"+i;})
				.attr("x", function(d){ return (d.location[0] * mapScaling - 2); })
				.attr("y", function(d){ return ((d.location[1] * mapScaling) - ((d.y2030 / populationFactor) * populationScaling) - 10); })
				.style("text-anchor", "middle");
});
