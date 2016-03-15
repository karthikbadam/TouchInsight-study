function ScatterPlot(options) {

    var _self = this;

    _self.parentId = options.parentId;

    _self.cols = options.cols;

    _self.margin = {
        top: 20,
        right: 50,
        bottom: 30,
        left: 40
    };


    _self.width = options.width - _self.margin.left - _self.margin.right;

    _self.height = options.height - _self.margin.top - _self.margin.bottom;
    
    if (options.scale) {
        _self.scale = options.scale;
        _self.margin = {
            top: 20 * _self.scale,
            right: 40 * _self.scale,
            bottom: 40 * _self.scale,
            left: 58 * _self.scale
        };

        _self.width = options.width - _self.margin.left - _self.margin.right;

        _self.height = options.height - _self.margin.top - _self.margin.bottom;
        
    } else {
        _self.scale = 1;   
    }

}


ScatterPlot.prototype.updateVisualization = function (data) {

    var _self = this;

    _self.formatValue = d3.format(".2s");

    _self.targetData = data;

    if (!_self.svg || _self.svg.select("#scatter").empty()) {

        _self.x = d3.scale.linear()
            .range([0, _self.width]);

        _self.y = d3.scale.linear()
            .range([_self.height, 0]);

        _self.color = d3.scale.category10();

        _self.xAxis = d3.svg.axis()
            .scale(_self.x)
            .orient("bottom")
            .tickFormat(function (d) {
                return _self.formatValue(d * d)
            });

        _self.yAxis = d3.svg.axis()
            .scale(_self.y)
            .orient("left")
            .tickFormat(function (d) {
                return _self.formatValue(d * d)
            });

        _self.svg = d3.select("#" + _self.parentId).append("svg")
            .attr("width", _self.width + _self.margin.left + _self.margin.right)
            .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + 
                  _self.margin.left + "," + _self.margin.top + ")")
            .style("font-size", 14*_self.scale+"px");

        _self.x.domain(d3.extent(_self.targetData, function (d) {
            return Math.pow(d["_id"][_self.cols[0]], 0.5);

            return d["_id"][_self.cols[0]];

            return Math.log(d["_id"][_self.cols[0]]) > 0 ? Math.log(d["_id"][_self.cols[0]]) : 0;

        })).nice();

        _self.y.domain(d3.extent(_self.targetData, function (d) {
            return Math.pow(d["_id"][_self.cols[1]], 0.5);
            return d["_id"][_self.cols[1]];
            return Math.log(d["_id"][_self.cols[1]]) > 0 ? Math.log(d["_id"][_self.cols[1]]) : 0;
        })).nice();

        _self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _self.height + ")")
            .call(_self.xAxis)
            .append("text")
            .attr("class", "label")
            .attr("x", _self.width)
            .attr("y", -6*_self.scale)
            .style("text-anchor", "end")
            .style("font-size", 14*_self.scale+"px")
            .text("Budget ($)");

        _self.svg.append("g")
            .attr("class", "y axis")
            .call(_self.yAxis)
            .append("text")
            .attr("class", "label")
            .attr("transform", "rotate(-90)")
            .attr("y", 6*_self.scale)
            .attr("dy", ".71em")
            .style("text-anchor", "end")
            .style("font-size", 14*_self.scale+"px")
            .text("Gross ($)");

        _self.svg.selectAll(".dot")
            .data(_self.targetData)
            .enter().append("circle")
            .attr("id", "scatter")
            .attr("class", "dot")
            .attr("r", 2.5*_self.scale)
            .attr("cx", function (d) {
                return _self.x(Math.pow(d["_id"][_self.cols[0]], 0.5));
                return _self.x(d["_id"][_self.cols[0]]);
                return _self.x(Math.log(d["_id"][_self.cols[0]]) > 0 ? Math.log(d["_id"][_self.cols[0]]) : 0);
            })
            .attr("cy", function (d) {
                return _self.y(Math.pow(d["_id"][_self.cols[1]], 0.5));
                return _self.y(d["_id"][_self.cols[1]]);
                return _self.y(Math.log(d["_id"][_self.cols[1]]) > 0 ? Math.log(d["_id"][_self.cols[1]]) : 0);
            })
            .style("fill", function (d) {
                //return "#4292c6";
                return _self.color(Math.ceil(d["_id"][ratings]));
            })
            .style("fill-opacity", function (d) {
                return d['_id'][ratings] / 20;
            });

        _self.legend = _self.svg.selectAll(".legend")
            .data(_self.color.domain())
            .enter().append("g")
            .attr("class", "legend")
            .attr("transform", function (d, i) {
                return "translate("+ 45*_self.scale + "," + i * 20*_self.scale + ")";
            });

        _self.legend.append("rect")
            .attr("x", _self.width - 18*_self.scale)
            .attr("width", 18*_self.scale)
            .attr("height", 18*_self.scale)
            .style("fill", _self.color);

        _self.legend.append("text")
            .attr("x", _self.width - 24*_self.scale)
            .attr("y", 9*_self.scale)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function (d) {
                return d;
            });

    } else {
     
        
        var dots = _self.svg.selectAll(".dot")
            .data(_self.targetData);
        
        dots.exit().remove();
        
        dots.enter().append("circle")
            .attr("id", "scatter")
            .attr("class", "dot")
            .attr("r", 2.5*_self.scale)
            .attr("cx", function (d) {
                return _self.x(Math.pow(d["_id"][_self.cols[0]], 0.5));
                return _self.x(d["_id"][_self.cols[0]]);
                return _self.x(Math.log(d["_id"][_self.cols[0]]) > 0 ? Math.log(d["_id"][_self.cols[0]]) : 0);
            })
            .attr("cy", function (d) {
                return _self.y(Math.pow(d["_id"][_self.cols[1]], 0.5));
                return _self.y(d["_id"][_self.cols[1]]);
                return _self.y(Math.log(d["_id"][_self.cols[1]]) > 0 ? Math.log(d["_id"][_self.cols[1]]) : 0);
            })
            .style("fill", function (d) {
                //return "#4292c6";
                return _self.color(Math.ceil(d["_id"][ratings]));
            })
            .style("fill-opacity", function (d) {
                return d['_id'][ratings] / 20;
            });
        
        dots.attr("r", 2.5*_self.scale)
            .attr("cx", function (d) {
                return _self.x(Math.pow(d["_id"][_self.cols[0]], 0.5));
                return _self.x(d["_id"][_self.cols[0]]);
                return _self.x(Math.log(d["_id"][_self.cols[0]]) > 0 ? Math.log(d["_id"][_self.cols[0]]) : 0);
            })
            .attr("cy", function (d) {
                return _self.y(Math.pow(d["_id"][_self.cols[1]], 0.5));
                return _self.y(d["_id"][_self.cols[1]]);
                return _self.y(Math.log(d["_id"][_self.cols[1]]) > 0 ? Math.log(d["_id"][_self.cols[1]]) : 0);
            })
            .style("fill", function (d) {
                //return "#4292c6";
                return _self.color(Math.ceil(d["_id"][ratings]));
            })
            .style("fill-opacity", function (d) {
                return d['_id'][ratings] / 20;
            });
        
        
    }

}