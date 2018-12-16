var svgWidth = 960;
var svgHeight = 500;

var margin = {top: 20, right: 40, bottom: 60, left: 100};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our scatterchart, and shift the latter by left and top margins.
var svg = d3
  .select('#scatter')
  .append('svg')
  .attr('width', svgWidth)
  .attr('height', svgHeight)
  .append('g')
  .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')');

var scatterchart = svg.append('g');

d3.csv('assets/data/data.csv').then (function(healtcareData) {

  healtcareData.forEach(function(data) {
    data.poverty = +data.poverty;
    data.healthcare = +data.healthcare;
  });
  // Create scale functions
  var yLinearScale = d3.scaleLinear().range([height, 0]);

  var xLinearScale = d3.scaleLinear().range([0, width]);

  // Create axis functions
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Scale the domain
  xLinearScale.domain([
    7,
    d3.max(healtcareData, function(data) {
      return +data.poverty;
    }),
  ]);
  yLinearScale.domain([
    0,
    d3.max(healtcareData, function(data) {
      return +data.healthcare * 1.2;
    }),
  ]);

  var toolTip = d3
    .tip()
    .attr('class', 'tooltip')
    .offset([80, -60])
    .html(function(data) {
      var stateName = data.state;
      var povertNum = +data.poverty;
      var healthcareNum = +data.healthcare;
      return (
        stateName + '<br> % Poverty: ' + povertNum + '<br> % Health Care: ' + healthcareNum
      );
    });

  scatterchart.call(toolTip);

  scatterchart
    .selectAll('circle')
    .data(healtcareData)
    .enter()
    .append('circle')
    .attr('cx', function(data, index) {
      return xLinearScale(data.poverty);
    })
    .attr('cy', function(data, index) {
      return yLinearScale(data.healthcare);
    })
    .attr('r', '15')
    .attr('fill', 'lightblue')
    .on('click', function(data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on('mouseout', function(data, index) {
      toolTip.hide(data);
    });

  scatterchart
    .append('g')
    .attr('transform', `translate(0, ${height})`)
    .call(bottomAxis);

  scatterchart.append('g').call(leftAxis);

  svg.selectAll("#dot")
  .data(healtcareData)
  .enter()
  .append("text")
  .text(function(data) { return data.abbr; })
  .attr('x', function(data) {
    return xLinearScale(data.poverty);
  })
  .attr('y', function(data) {
    return yLinearScale(data.healthcare);
  })
  .attr("font-size", "9px")
  .attr("fill", "white")
  .style("text-anchor", "middle");

  scatterchart
    .append('text')
    .attr('transform', 'rotate(-90)')
    .attr('y', 0 - margin.left + 40)
    .attr('x', 0 - height / 2)
    .attr('dy', '1em')
    .attr('class', 'axisText')
    .text('Lacks Healthcare (%)');

  // Append x-axis labels
  scatterchart
    .append('text')
    .attr(
      'transform',
      'translate(' + width / 2 + ' ,' + (height + margin.top + 30) + ')',
    )
    .attr('class', 'axisText')
    .text('In Poverty (%)');
});

