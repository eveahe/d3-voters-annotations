"use strict";

//code mostly from: https://bl.ocks.org/susielu/63269cf8ec84497920f2b7ef1ac85039
// line chart code: https://bl.ocks.org/d3noob/402dd382a51a4f6eea487f9a35566de0
// time series from: http://bl.ocks.org/mbostock/3883245
// set the dimensions and margins of the graph
// colors thanks to http://vrl.cs.brown.edu/color
var margin = { top: 20, right: 20, bottom: 30, left: 80 },
    height = 500 - margin.top - margin.bottom;
var maxWidth = 860 - margin.left - margin.right;
var width = 860 - margin.left - margin.right;

var parseTime = d3.timeParse("%d-%b-%Y");
var _x = d3.scaleTime().range([0, width]);
var _y = d3.scaleLinear().range([height, 0]);
var line_colors = ["rgb(138,225,249)", "rgb(147,130,233)", "rgb(69,141,166)", "rgb(238,128,254)", "rgb(27,72,188)"]

//"rgb(130,160,202)"
var valueline = d3.line().x(function (d) {
  return _x(d.date);
}).y(function (d) {
  return _y(d.mail);
});

//Adding the additional lines, need to figure out how to make this more DRY!
var valueline2 = d3.line().x(function (d) {
  return _x(d.date);
}).y(function (d) {
  return _y(d.asst);
});

var valueline3 = d3.line().x(function (d) {
  return _x(d.date);
}).y(function (d) {
  return _y(d.dhsmv);
});

var valueline4 = d3.line().x(function (d) {
  return _x(d.date);
}).y(function (d) {
  return _y(d.ovr);
});

var valueline5 = d3.line().x(function (d) {
  return _x(d.date);
}).y(function (d) {
  return _y(d.other);
});


var svg = d3.select("svg").attr("width", 960).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.tsv("test.tsv", function (error, data) {
  if (error) throw error;

  data.forEach(function (d) {
    d.date = parseTime(d.date);
    d.mail = +d.mail;
    d.asst = +d.asst;
    d.dhsmv = +d.dhsmv;
    d.other = +d.other;
    d.ovr = +d.ovr;
  });

  _x.domain(d3.extent(data, function (d) {
    return d.date;
  }));
  _y.domain([0, d3.max(data, function (d) {
    return d.other;
  })]);

  svg.append("path").data([data])
        .attr("class", "line")
        .attr("stroke", line_colors[0])
        .attr("d", valueline);

         // Add the valueline2 path.
  svg.append("path")
         .data([data])
         .attr("class", "line")
         .attr("fill", "none")
         .style("stroke", line_colors[1])
         .attr("d", valueline2);
  
  svg.append("path")
         .data([data])
         .attr("class", "line")
         .attr("fill", "none")
         .style("stroke", line_colors[2])
         .attr("d", valueline3);
  
  svg.append("path")
         .data([data])
         .attr("class", "line")
         .attr("fill", "none")
         .style("stroke", line_colors[3])
         .attr("d", valueline4);
  
  svg.append("path")
         .data([data])
         .attr("class", "line")
         .attr("fill", "none")
         .style("stroke", line_colors[4])
         .attr("d", valueline5);

  svg.append("g").attr("class", "x-axis").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(_x));

  svg.append("g").call(d3.axisLeft(_y));

  //Add annotations
  var labels = [{
    data: { date: "20-Apr-2004", other: 1202036 },
    dy: 40,
    dx: -100,
  },  {
    data: { date: "20-Apr-2008", other: 420004 },
    dy: -37,
    dx: 42,
  }].map(function (l) {
    l.note = Object.assign({}, l.note, { title: l.data.other.toLocaleString(),
      label: "people"
     });
    l.subject = { radius: 6 };

    return l;
  });

  var timeFormat = d3.timeFormat("%d-%b-%y");

  window.makeAnnotations = d3.annotation().annotations(labels).type(d3.annotationCalloutCircle).accessors({ x: function x(d) {
      return _x(parseTime(d.date));
    },
    y: function y(d) {
      return _y(d.other);
    }
  }).accessorsInverse({
    date: function date(d) {
      return timeFormat(_x.invert(d.x));
    },
    close: function close(d) {
      return _y.invert(d.y);
    }
  }).on('subjectover', function (annotation) {
    annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", false);
  }).on('subjectout', function (annotation) {
    annotation.type.a.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);
  });

  svg.append("g").attr("class", "annotation-test").call(makeAnnotations);

  svg.selectAll("g.annotation-connector, g.annotation-note").classed("hidden", true);

  var ordinal = d3.scaleOrdinal()
  .domain(["Mail", "Public Assistance Offices", "DMV", "Online", "Voter Registration Drives*"])
  .range(line_colors);

// var svg = d3.select("svg");

svg.append("g")
  .attr("class", "legendOrdinal")
  .attr("transform", "translate(570,10)");


var legendOrdinal = d3.legendColor()
  //d3 symbol creates a path-string, for example
  //"M0,-8.059274488676564L9.306048591020996,
  //8.059274488676564 -9.306048591020996,8.059274488676564Z"
  .shape("path", d3.symbol().type(d3.symbolCircle).size(150)())
  .shapePadding(10)

  .scale(ordinal);

svg.select(".legendOrdinal")
  .call(legendOrdinal);
          


});

          
