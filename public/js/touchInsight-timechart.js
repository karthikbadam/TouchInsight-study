function TimeChart(options) {

    var _self = this;

    _self.parentId = options.parentId;

    _self.cols = options.cols;

    _self.margin = {
        top: 5,
        right: 10,
        bottom: 20,
        left: 45
    };

    _self.text = options.text;

    _self.width = options.width - _self.margin.left - _self.margin.right;

    _self.height = options.height - _self.margin.top - _self.margin.bottom;

}

TimeChart.prototype.updateVisualization = function (data) {

    var _self = this;
    
    _self.targetData = data;
    
    _self.parseDate = d3.time.format("%b/%Y").parse;
    _self.parseDate = d3.time.format("%Y").parse;

    if (!_self.svg || _self.svg.select("path").empty()) {

        _self.svg = d3.select("#" + _self.parentId)
            .append("svg")
            .attr("id", "timechart")
            .attr("width", _self.width + _self.margin.left + _self.margin.right)
            .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (_self.margin.left) + "," +
                _self.margin.top + ")");

        _self.x = d3.time.scale().range([0, _self.width]);

        var x = _self.x;

        var y = _self.y = d3.scale.linear()
            .range([_self.height, 0]);

        var xAxis = _self.xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .tickFormat(function (d) {
                return d3.time.format('%Y')(new Date(d));
            })
            .innerTickSize(-_self.height)
            .outerTickSize(0)
            .tickPadding(10);
        
        _self.xAxis.ticks(d3.time.years, 1);

        if (device == "MOBILE2") {
            _self.xAxis.ticks(d3.time.years, 2);
        }

        _self.xAxis.ticks(d3.time.years, 4);

        var yAxis = _self.yAxis = d3.svg.axis()
            .scale(y)
            .orient("left").tickFormat(d3.format("s"))
            .innerTickSize(-_self.width)
            .outerTickSize(0)
            .tickPadding(10)
            .ticks(_self.height / 20);

        var area = _self.area = d3.svg.area()
            .interpolate("linear") 
            .x(function (d) {
                return _self.x(_self.parseDate(d[_self.cols[0]]));
            })
            .y0(_self.height)
            .y1(function (d) {
                return _self.y(d[_self.cols[1]]);
            });

        x.domain(d3.extent(_self.targetData, function (d) {
            return _self.parseDate(d[_self.cols[0]]);
        }));

        y.domain(d3.extent(_self.targetData, function (d) {
            return d[_self.cols[1]];
        }));

        _self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _self.height + ")")
            .call(xAxis);

        _self.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("x", 10)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .style("font-size", "14px")
            .text(_self.text);

        _self.targetData.sort(function (a, b) {
            if (_self.parseDate(b[_self.cols[0]]).getTime() <
                _self.parseDate(a[_self.cols[0]]).getTime()) return 1;
            return -1;
        });

        _self.svg.append("path")
            .datum(_self.targetData)
            .attr("id", "time")
            .attr("class", "flightsTime")
            .attr("d", area)
            .attr("fill", "#9ecae1")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "#9ecae1")
            .attr("stroke-width", "1.5px");

    } else {

        _self.targetData.sort(function (a, b) {
            if (_self.parseDate(b[_self.cols[0]]).getTime() <
                _self.parseDate(a[_self.cols[0]]).getTime()) return 1;
            return -1;
        });

        _self.y.domain(d3.extent(_self.targetData, function (d) {
            return d[_self.cols[1]];
        }));

        _self.yAxis.scale(_self.y);

        _self.svg.select(".y.axis")
            .call(_self.yAxis);

        _self.svg.select("#time")
            .datum(_self.targetData)
            .attr("d", _self.area)
            .attr("fill", "#9ecae1")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "#9ecae1")
            .attr("stroke-width", "1.5px");

    }

}