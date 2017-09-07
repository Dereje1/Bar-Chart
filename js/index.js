const url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"
const margin = {top: 20, right: 30, bottom: 30, left: 50}
let width = window.innerWidth*.85-margin.left-margin.right,
    height = 700-margin.top-margin.bottom;
let dateFormat = d3.timeParse("%Y-%m-%d")//initial parse to d3
let formatTime = d3.timeFormat("%B %Y");//parse time out from d3 for toolTip
let axistFormatTime = d3.timeFormat("%Y");//parse time out from d3 for xaxis
let gdpFormat=d3.format("$");//format for toolTip

let x = d3.scaleTime()//x axis scale for d3 interpretation
    .rangeRound([0, width]);
let y = d3.scaleLinear()//y axis scale for d3 interpretation
    .range([height, 0]);
let x2 = d3.scaleTime()//scale used only for x axis display purposes
    .domain([new Date(1947, 0, 1), new Date(2016, 0, 1)])
    .rangeRound([0, width]);
let xAxis = d3.axisBottom(x2)//xaxis display properties
    .tickFormat(d3.timeFormat("%Y"));
let yAxis = d3.axisLeft(y)//yaxis display properties

let toolTipDiv = d3.select("body").append("div")//toolTip div definition, definition in css sheet would not work for me???
            .attr("class", "toolTip")
            .style("position", "absolute")
            .style("color", "darkgreen")
            .style("background-color", "white")
            .style("font-size", "24px")
            .style("border-radius", "3px");

let chart = d3.select(".chart")//main chart definition
    .attr("width", width + margin.left + margin.right)//margins added for axis
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.json(url,function(error,gdpData){//use d3's own json capabilites to get data
  if (error) throw error;
  //resturnture data in a format d3 can understand, object{x,y} per data point
  let transposedGDP = gdpData.data.map(function(d){
    let val={}
    val.date = dateFormat(d[0])//parse date
    val.gdp = d[1]
    return val
  })

  //set domains for x an y scales per tutorial
  x.domain(transposedGDP.map(function(d) { return d.date; }));
  y.domain([0, d3.max(transposedGDP, function(d) { return d.gdp})]);


  let barWidth = width / transposedGDP.length;

  let bar = chart.selectAll("g")//d3 selects "future" g elements to draw on
    .data(transposedGDP)
    .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")//add rectangle
    .attr("y", function(d) {return y(d.gdp);})
    .attr("height", function(d) { return height - y(d.gdp); })//(0 is a the top for y axis)
    .attr("width", barWidth)

    .on("mouseover", function(d) {//tool tip functionality
       toolTipDiv.html("<strong>" + formatTime(d.date) + "</strong><br/>" + gdpFormat(d.gdp)+" Bn")
         .style("left", (d3.event.pageX) + "px")
         .style("top", (d3.event.pageY+40) + "px")
         .style("visibility", "visible");
       })
     .on("mouseout", function(d) {
       toolTipDiv.style("visibility", "hidden");
       });

  chart.append("g")//add xaxis
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);
  chart.append("g")//add yaxis
      .attr("class", "y axis")
      .call(yAxis);

  chart.append("text")//add title
        .attr("x", (width / 2))
        .attr("y", 50)
        .attr("text-anchor", "middle")
        .style("font-size", "35px")
        .style("fill", "white")
        .style("cursor","pointer")
        .style("href",url)
        .text("US Historical GDP")
        .on("click",function(){window.open(url,"_blank")})
  chart.append("text")//add y axis label
        .attr("transform", "rotate(-90)")
        .attr("y", 10)
        .attr("x",0 - (height / 2))
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .style("font-size", "20px")
        .style("fill", "white")
        .text("USD Billion");
})
