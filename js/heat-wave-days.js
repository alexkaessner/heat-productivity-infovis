function sliderMoved(newValue)
{
  if (newValue >= 100) {
    console.log("far future: " + (newValue - 100));
    d3.selectAll(".img-1").style("opacity", function(){ return (newValue - 100)/100; })
  }else {
    console.log("near future: " + newValue);
    d3.selectAll(".img-2").style("opacity", function(){ return (newValue/100); })
  }

	//document.getElementById("range").innerHTML=newValue;
}
