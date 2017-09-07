const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const margin = {top: 20, right: 30, bottom: 30, left: 50}
let width = window.innerWidth*.85-margin.left-margin.right,
    height = 700-margin.top-margin.bottom;
let datePoint = "1949-04-01"
let dateFormat = d3.timeParse("%Y-%m-%d")
let formatTime = d3.timeFormat("%B %Y");
let axistFormatTime = d3.timeFormat("%Y");
let gdpFormat=d3.format("$");
console.log(dateFormat(datePoint))
let x= d3.scaleTime()
    .rangeRound([0, width]);
let y = d3.scaleLinear()
    .range([height, 0]);
let x2 = d3.scaleTime()
    .domain([new Date(1947, 0, 1), new Date(2016, 0, 1)])
    .rangeRound([0, width]);
let xAxis = d3.axisBottom(x2)
    .tickFormat(d3.timeFormat("%Y"));
let yAxis = d3.axisLeft(y)

let div = d3.select("body").append("div")
      .attr("class", "toolTip")
      .style("position", "absolute")
      .style("color", "darkgreen")
      .style("background-color", "white")
      .style("font-size", "30px")
      .style("border-radius", "3px");

let chart = d3.select(".chart")
    .attr("width", width + margin.left + margin.right)//margins added for axis
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url,function(gdpData){

  let transposedGDP = gdpData.data.map(function(d){
    let val={}
    val.date = dateFormat(d[0])
    val.gdp = d[1]
    return val
  })

  x.domain(transposedGDP.map(function(d) { return d.date; }));
  y.domain([0, d3.max(transposedGDP, function(d) { return d.gdp})]);


  let barWidth = width / transposedGDP.length;

  let bar = chart.selectAll("g")
    .data(transposedGDP)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
    .attr("y", function(d) {return y(d.gdp);})
    .attr("height", function(d) { return height - y(d.gdp); })
    .attr("width", barWidth)

    .on("mouseover", function(d) {
       div.html("<strong>" + formatTime(d.date) + "</strong><br/>" + gdpFormat(d.gdp)+" Bn")
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY) + "px")
         .style("visibility", "visible");
       })
     .on("mouseout", function(d) {
       div.style("visibility", "hidden");
       });

  chart.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  chart.append("g")
      .attr("class", "y axis")
      .call(yAxis);
  chart.append("text")
        .attr("x", (width / 2))
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "35px")
        .style("fill", "white")
        .text("US Historical GDP");
  chart.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "white")
        .text("USD Billion");
})
