// IMPORT EXTERNAL SVG ---------------------------------------------------------
// little map selection
d3.xml("graphics/dotted-worldmap.svg").mimeType("image/svg+xml").get(function(error, xml) {
  if (error) throw error;
  document.getElementById("dotted-world-map").appendChild(xml.documentElement);
});
