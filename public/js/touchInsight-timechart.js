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
                _self.margin.top + ")")
            .style("font-size", 14* _self.scale + "px");

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
            .tickPadding(10* _self.scale);

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
            .tickPadding(10* _self.scale)
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
            .attr("x", 10* _self.scale)
            .attr("dy", "1em")
            .style("text-anchor", "start")
            .style("font-size", 14* _self.scale + "px")
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

TimeChart.prototype.updateMicroViz = function (data) {

    var _self = this;

    d3.select("#horizon-" + _self.cols[1]).remove();

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

        _self.svg.data([data]).call(chart);

        _self.x = d3.time.scale().range([0, _self.width]);

        _self.x.domain([_self.parseDate("1915"), _self.parseDate("2011")]);

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
            .range([_self.height+_self.margin.bottom, 0]);

        var yAxis = _self.yAxis = d3.svg.axis()
            .scale(_self.y)
            .orient("left").tickFormat(d3.format("s"))
            .innerTickSize(-_self.width)
            .outerTickSize(0)
            .tickPadding(10)
            .ticks(_self.height / 20);

        y.domain(d3.extent(_self.targetData, function (d) {
            return d[_self.cols[1]]/2;
        }));
        
        _self.svg.append("g")
            .attr("class", "y axis")
            .call(yAxis);
        
    } else {

        _self.chart.width(_self.majorDimension)
            .height(_self.minorDimension);

        _self.svg
            .attr("width", _self.majorDimension)
            .attr("height", _self.minorDimension)
            .style("transform-origin", function () {
                if (direction == "left")
                    return "left bottom";

                if (direction == "right")
                    return "left bottom";


            })
            .style("-webkit-transform", function () {
                if (direction == "left")
                    return "translate(0px," + (-_self.minorDimension) + "px)" + " " + "rotate(90deg)";

                if (direction == "right")
                    return "translate(0px," + (-_self.minorDimension) + "px)" + " " + "rotate(90deg)";

                return "translate(0px,0px)";
            });

        _self.targetData.sort(function (a, b) {
            if (parseDate(b["_id"][date]).getTime() <
                parseDate(a["_id"][date]).getTime()) return 1;
            return -1;
        });

        var chart = _self.chart;

        // Offset so that positive is above-average and negative is below-average.
        var mean = _self.targetData.reduce(function (sum, v) {

            if (sum[_self.target])
                return sum[_self.target] + v[_self.target];
            else
                return sum + v[_self.target];

        }) / _self.targetData.length;

        console.log(mean);

        // Transpose column values to rows.
        var data = _self.targetData.map(function (d, i) {
            return [parseDate(d["_id"][date]), d[_self.target] - mean];
        });

        _self.svg.data([data]).call(chart);

        _self.x = d3.time.scale().range([0, _self.majorDimension]);

        _self.x.domain([parseDate("1990"), parseDate("2009")]);

        var xAxis = _self.xAxis = d3.svg.axis()
            .scale(_self.x)
            .orient("bottom")
            .tickFormat(function (d) {
                return d3.time.format('%Y')(new Date(d));
            });

        _self.xAxis.ticks(d3.time.years, 2);

        _self.svg.select(".x.axis")
            .attr("transform", "translate(0," + (_self.minorDimension - _self.margin.bottom) + ")")
            .call(xAxis);

        _self.svg.select(".x.axis").select("path")
            .style("display", "none");


        _self.svg.select("text")
            .attr("transform", "translate(" + 10 + "," + 15 + ")");
    }
}