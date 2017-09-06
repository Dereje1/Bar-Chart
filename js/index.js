let url = "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/GDP-data.json"

let width = 960,
    height = 500;


let y = d3.scaleLinear()
    .range([height, 0]);
console.log(y)
let chart = d3.select(".chart")
    .attr("width", width)
    .attr("height", height);

d3.json(url,function(gdpData){
  let xDates = gdpData.data.map((d)=>d[0])
  let ygdp = gdpData.data.map((d)=>d[1])

  y.domain([0, d3.max(ygdp, function(d) { return d})]);
  let barWidth = width / ygdp.length;

  let bar = chart.selectAll("g")
    .data(ygdp)
  .enter().append("g")
    .attr("transform", function(d, i) { return "translate(" + i * barWidth + ",0)"; });

  bar.append("rect")
    .attr("y", function(d) {
      console.log(d)
      return y(d);})
    .attr("height", function(d) { return height - y(d); })
    .attr("width", barWidth - 1);
  console.log(ygdp)
})
