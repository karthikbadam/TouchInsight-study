function TimeChart(options) {

    var _self = this;

    _self.parentId = options.parentId;

    _self.cols = options.cols;

    _self.margin = {
        top: 2,
        right: 10,
        bottom: 20,
        left: 45
    };

    _self.text = options.text;

    _self.width = options.width - _self.margin.left - _self.margin.right;

    _self.height = options.height - _self.margin.top - _self.margin.bottom;

    if (options.scale) {
        _self.scale = options.scale;
        _self.margin = {
            top: 10 * _self.scale,
            right: 30 * _self.scale,
            bottom: 30 * _self.scale,
            left: 58 * _self.scale
        };

        _self.width = options.width - _self.margin.left - _self.margin.right;

        _self.height = options.height - _self.margin.top - _self.margin.bottom;

    } else {
        _self.scale = 1;
    }

    _self.dataDomain = null;

}

TimeChart.prototype.fillGaps = function (data) {

    var _self = this;

    var rd = {};

    _self.dataDomain.forEach(function (d) {

        rd[d] = 0;

    });

    data.forEach(function (d) {

        var timeKey = d[_self.cols[0]];

        rd[timeKey] = d[_self.cols[1]];

    });

    var returnData = [];

    var keys = Object.keys(rd);

    for (var i = 0; i < keys.length; i++) {
        var key = keys[i];

        var temp = {};
        temp[_self.cols[0]] = key;
        temp[_self.cols[1]] = rd[key];

        returnData.push(temp);
    }
    return returnData;
}

TimeChart.prototype.updateVisualization = function (data, duration) {

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
                _self.margin.top + ")")
            .style("font-size", 11 * _self.scale + "px");

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
            .tickPadding(10 * _self.scale);

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
            .tickPadding(10 * _self.scale)
            .ticks(Math.round(_self.height / 20));

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

        if (_self.dataDomain == null) {
            _self.dataDomain = d3.map(_self.targetData, function (d) {
                return d[_self.cols[0]];
            });
        }

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
            .attr("x", 10 * _self.scale)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .style("font-size", 14 * _self.scale + "px")
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

        var returnData = _self.fillGaps(_self.targetData);

        _self.y.domain(d3.extent(returnData, function (d) {
            return d[_self.cols[1]];
        }));

      _self.yAxis.scale(_self.y);

        _self.svg.select(".y.axis")
            .transition().duration(duration).ease("linear")
            .call(_self.yAxis);

        returnData = returnData.sort(function (a, b) {
            if (_self.parseDate(b[_self.cols[0]]).getTime() <
                _self.parseDate(a[_self.cols[0]]).getTime()) return 1;
            return -1;
        });

        _self.svg.select("#time")
            .datum(returnData)
            .transition().duration(duration).ease("linear")
            .attr("d", _self.area)
            .attr("fill", "#9ecae1")
            .attr("fill-opacity", 0.8)
            .attr("stroke", "#9ecae1")
            .attr("stroke-width", "1.5px");

    }

}

TimeChart.prototype.updateMicroViz = function (data, duration) {

    var _self = this;

    //d3.select("#horizon-" + _self.cols[1]).remove();

    _self.targetData = data;

    _self.parseDate = d3.time.format("%b/%Y").parse;
    _self.parseDate = d3.time.format("%Y").parse;

    if (d3.select("#horizon-" + _self.cols[1]).empty() ||
        _self.svg.select("path").empty()) {

        $("#" + _self.parentId).empty();

        _self.targetData.sort(function (a, b) {
            if (_self.parseDate(b[_self.cols[0]]).getTime() <
                _self.parseDate(a[_self.cols[0]]).getTime()) return 1;
            return -1;
        });

        _self.chart = d3.horizon()
            .width(_self.width)
            .height(_self.height + _self.margin.bottom)
            .bands(2)
            .mode("mirror")
            .interpolate("basis");

        var chart = _self.chart;

        _self.svg = d3.select("#" + _self.parentId).append("svg")
            .attr("id", "horizon-" + _self.cols[1])
            .attr("width", _self.width + _self.margin.left + _self.margin.right)
            .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + _self.margin.left + "," +
                _self.margin.top + ")");

        // Offset so that positive is above-average and negative is below-average.
        var mean = _self.targetData.reduce(function (sum, v) {
            if (sum[_self.cols[1]])
                return sum[_self.cols[1]] + v[_self.cols[1]];
            else
                return sum + v[_self.cols[1]];

        }) / _self.targetData.length;

        console.log(mean);

        mean = 0;
        
        // Transpose column values to rows.
        var data = _self.targetData.map(function (d, i) {
            return [_self.parseDate(d[_self.cols[0]]), d[_self.cols[1]] - mean];
        });

        _self.svg.data([data]).transition().duration(1000).call(chart);

        _self.x = d3.time.scale().range([0, _self.width]);

        _self.x.domain([_self.parseDate("1915"), _self.parseDate("2011")]);
        
        if (_self.dataDomain == null) {
            _self.dataDomain = d3.map(_self.targetData, function (d) {
                return d[_self.cols[0]];
            });
        }

        var xAxis = _self.xAxis = d3.svg.axis()
            .scale(_self.x)
            .orient("bottom")
            .tickFormat(function (d) {
                return d3.time.format('%Y')(new Date(d));
            });

        _self.xAxis.ticks(d3.time.years, 2);

        _self.svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + _self.height + ")")
            .call(xAxis);

        _self.svg.select(".x.axis").select("path")
            .style("display", "none");

        _self.svg.selectAll(".tick text")
            .style("font-size", "8px");

        _self.svg.append("text")
            .attr("transform", "translate(" + 10 + "," + 15 + ")")
            .text(_self.text)
            .style("font-size", "13px");

        var y = _self.y = d3.scale.linear()
            .range([_self.height + _self.margin.bottom, 0]);
        
        y.domain(d3.extent(_self.targetData, function (d) {
            return d[_self.cols[1]] / 2;
        }));

        var yAxis = _self.yAxis = d3.svg.axis()
            .scale(_self.y)
            .orient("left").tickFormat(d3.format("s"))
            .innerTickSize(-_self.width)
            .outerTickSize(0)
            .tickPadding(10)
            .ticks(4);

        _self.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);

    } else {
        
         var returnData = _self.fillGaps(_self.targetData);

        returnData = returnData.sort(function (a, b) {
            if (_self.parseDate(b[_self.cols[0]]).getTime() <
                _self.parseDate(a[_self.cols[0]]).getTime()) return 1;
            return -1;
        });

        var chart = _self.chart;

        // Offset so that positive is above-average and negative is below-average.
        var mean = returnData.reduce(function (sum, v) {
            if (sum[_self.cols[1]])
                return sum[_self.cols[1]] + v[_self.cols[1]];
            else
                return sum + v[_self.cols[1]];

        }) / returnData.length;

        console.log(mean);

        mean = 0;
        
        // Transpose column values to rows.
        var data = returnData.map(function (d, i) {
            return [_self.parseDate(d[_self.cols[0]]), d[_self.cols[1]] - mean];
        });
        
        _self.svg.data([data]).call(_self.chart.duration(duration));
            
        //_self.svg;
        
        _self.y.domain(d3.extent(returnData, function (d) {
            return d[_self.cols[1]] / 2;
        }));

        var yAxis = _self.yAxis
            .scale(_self.y)
            .orient("left").tickFormat(d3.format("s"))
            .innerTickSize(-_self.width)
            .outerTickSize(0)
            .tickPadding(10)
            .ticks(4);

        _self.svg.select(".y.axis")
            .call(yAxis);
    }
}