function ScatterPlot(options) {

    var _self = this;

    _self.parentId = options.parentId;

    _self.cols = options.cols;

    _self.margin = {
        top: 20,
        right: 0,
        bottom: 30,
        left: 30
    };


    _self.width = options.width - _self.margin.left - _self.margin.right;

    _self.height = options.height - _self.margin.top - _self.margin.bottom;

}


ScatterPlot.prototype.updateVisualization = function (data) {

    var _self = this;

    _self.data = data;

    _self.x = d3.scale.linear()
        .range([0, width]);

    _self.y = d3.scale.linear()
        .range([height, 0]);

    _self.color = d3.scale.category10();

    _self.xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    _self.yAxis = d3.svg.axis()
        .scale(_self.y)
        .orient("left");

    _self.svg = d3.select("body").append("svg")
        .attr("width", _self.width + _self.margin.left + _self.margin.right)
        .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
        .append("g")
        .attr("transform", "translate(" + _self.margin.left + "," + _self.margin.top + ")");

    _self.x.domain(d3.extent(_self.data, function (d) {
        return d[_self.cols[0]];
    })).nice();

    _self.y.domain(d3.extent(_self.data, function (d) {
        return d[_self.cols[1]];
    })).nice();

    _self.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + _self.height + ")")
        .call(_self.xAxis)
        .append("text")
        .attr("class", "label")
        .attr("x", _self.width)
        .attr("y", -6)
        .style("text-anchor", "end")
        .text("Budget ($)");

    _selfsvg.append("g")
        .attr("class", "y axis")
        .call(_selfyAxis)
        .append("text")
        .attr("class", "label")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("Gross ($)")

    _self.svg.selectAll(".dot")
        .data(_self.data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("r", 3.5)
        .attr("cx", function (d) {
            return _self.x(d[_self.cols[0]]);
        })
        .attr("cy", function (d) {
            return _self.y(d[_self.cols[1]]);
        })
        .style("fill", function (d) {
            return _self.color(d[genre]);
        });

    _self.legend = _self.svg.selectAll(".legend")
        .data(_self.color.domain())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
            return "translate(0," + i * 20 + ")";
        });

    _self.legend.append("rect")
        .attr("x", _self.width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", _self.color);

    _self.legend.append("text")
        .attr("x", _self.width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
            return d;
        });

}