function Bar(options) {

    var _self = this;

    _self.parentId = options.parentId;

    _self.cols = options.cols;

    _self.link = options.link;

    _self.text = options.text;

    _self.margin = {
        top: 5,
        right: 30,
        bottom: 30,
        left: 58
    };


    _self.width = options.width - _self.margin.left - _self.margin.right;

    _self.actualheight = options.height - _self.margin.top - _self.margin.bottom;

    _self.myFormat = d3.format(',');

    if (options.scale) {
        _self.scale = options.scale;
        _self.margin = {
            top: 5 * _self.scale,
            right: 30 * _self.scale,
            bottom: 30 * _self.scale,
            left: 58 * _self.scale
        };

        _self.width = options.width - _self.margin.left - _self.margin.right;

        _self.actualheight = options.height - _self.margin.top - _self.margin.bottom;
    } else {
        _self.scale = 1;
    }
}

Bar.prototype.updateVisualization = function (data, duration) {

    var _self = this;

    data.sort(function (a, b) {
        if (a[_self.cols[1]] < b[_self.cols[1]]) return 1;
        return -1;
    });

    _self.targetData = data;

    d3.select("#" + _self.parentId).style("overflow", "hidden");

    if (!_self.svg || _self.svg.select("rect").empty()) {

        _self.height = 10000 * _self.scale;

        d3.select("#" + _self.parentId).append("text")
            .style("padding-left", 10 * _self.scale + "px")
            .text(_self.text)
            .style("font-size", 14 * _self.scale + "px");

        _self.svg = d3.select("#" + _self.parentId).append("div")
            .style("overflow", "scroll")
            .style("width", _self.width + _self.margin.left + _self.margin.right)
            .style("height", _self.actualheight + _self.margin.top + _self.margin.bottom - 15)
            .append("svg")
            .attr("id", _self.target + "bar")
            .attr("width", _self.width + _self.margin.left + _self.margin.right - 5)
            .attr("height", _self.height + _self.margin.top + _self.margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (_self.margin.left) + "," +
                _self.margin.top + ")")
            .style("font-size", 11 * _self.scale + "px");

        _self.x = d3.scale.linear()
            .domain([0, d3.max(_self.targetData, function (d) {
                return Math.pow(d[_self.cols[1]], 1);
            })])
            .range([0, _self.width]);

        _self.y = d3.scale.ordinal()
            .domain(_self.targetData.map(function (d) {
                return d[_self.cols[0]];
            }))
            .rangeBands([0, _self.height]);

        //_self.barH = _self.height / _self.targetData.length;
        _self.barH = 30 * _self.scale;

        _self.bars = _self.svg.selectAll("g")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            }).enter().append("g")
            .attr("transform", function (d, i) {
                return "translate(" + _self.margin.left + "," + i * _self.barH + ")";
            });

        _self.bars.append("rect")
            .attr("width", function (d) {
                return _self.x(Math.pow(d[_self.cols[1]], 1));
            })
            .attr("height", _self.barH - 5)
            .attr("fill-opacity", 1)
            .attr("fill", "#9ecae1");

        _self.bars.append("text")
            .attr("x", function (d) {
                return 5;
            })
            .attr("y", _self.barH / 3)
            .attr("fill", "#222")
            .attr("fill-opacity", 1)
            .attr("text-anchor", "start")
            .attr("dy", ".35em")
            .text(function (d) {
                return _self.myFormat(Math.round(d[_self.cols[1]]));
            })
            .style("pointer-events", "none");

        _self.svg.selectAll("text.name")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            }).enter().append("text")
            .attr("x", _self.margin.left - 5)
            .attr("y", function (d, i) {
                return i * _self.barH + _self.barH / 2;
            })
            .attr("fill", "#222")
            .attr("text-anchor", "end")
            .attr('class', 'name')
            .text(function (d) {
                return d[_self.cols[0]];
            });

    } else {

        var allBars = _self.svg.selectAll("g")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            });

        allBars.exit().select("rect").transition().duration(duration)
            .attr("width", 3).attr("fill", "#AAA")
            .attr("fill-opacity", 0.01);

        allBars.exit().select("text").transition().duration(duration).attr("fill", "#AAA")
            .attr("fill-opacity", 0.01);

        _self.x = d3.scale.linear()
            .domain([0, d3.max(_self.targetData, function (d) {
                return Math.pow(d[_self.cols[1]], 1);
            })])
            .range([0, _self.width]);

        _self.y = d3.scale.ordinal()
            .domain(_self.targetData.map(function (d) {
                return d[_self.cols[0]];
            }))
            .rangeBands([0, _self.height]);

        //        var rects = allBars.enter().append("g")
        //            .attr("transform", function (d, i) {
        //                return "translate(" + _self.margin.left + "," + i * _self.barH + ")";
        //            });

        //        rects.append("rect")
        //            .attr("width", function (d) {
        //                return _self.x(Math.pow(d[_self.cols[1]], 1));
        //            })
        //            .attr("height", _self.barH - 5)
        //            .attr("fill-opacity", 1)
        //            .attr("fill", "#9ecae1");

        //        rects.append("text")
        //            .attr("x", function (d) {
        //                return 5;
        //            })
        //            .attr("y", _self.barH / 3)
        //            .attr("fill", "#222")
        //            .attr("text-anchor", "start")
        //            .attr("dy", ".35em")
        //            .attr("fill-opacity", 1)
        //            .text(function (d) {
        //                return _self.myFormat(Math.round(d[_self.cols[1]]));
        //            })
        //            .style("pointer-events", "none");

        allBars.select("rect")
            .transition().duration(duration)
            .attr("width", function (d) {
                return _self.x(Math.pow(d[_self.cols[1]], 1));
            })
            .attr("height", _self.barH - 5)
            .attr("fill", "#9ecae1")
            .attr("fill-opacity", 1);

        allBars
            .select("text")
            //            .attr("x", function (d) {
            //                return 5;
            //            })
            //            .attr("y", _self.barH / 3)
            .transition().duration(duration)
            .attr("fill", "#222")
            .attr("fill-opacity", 1)
            .attr("text-anchor", "start")
            .attr("dy", ".35em")
            .text(function (d) {
                return _self.myFormat(Math.round(d[_self.cols[1]]));
            });


        var allText = _self.svg.selectAll("text.name").data(data, function name(d) {
            return d[_self.cols[0]];
        });

        allText.exit().transition().duration(duration).attr("fill", "#AAA");

        //        allText.enter().append("text")
        //            .attr("x", _self.margin.left - 5)
        //            .attr("y", function (d, i) {
        //                return i * _self.barH + _self.barH / 2;
        //            })
        //            .attr("fill", "#222")
        //            .attr("text-anchor", "end")
        //            .text(function (d) {
        //                return d[_self.cols[0]];
        //            });

        allText.transition().duration(duration)
            //            .attr("x", _self.margin.left - 5)
            //            .attr("y", function (d, i) {
            //                return i * _self.barH + _self.barH / 2;
            //            })
            .attr("fill", "#222")
            .attr("text-anchor", "end")
            .attr('class', 'name')
            .text(function (d) {
                return d[_self.cols[0]];
            });

    }

}

Bar.prototype.updateMicroViz = function (data, duration) {

    var _self = this;

    var direction = "left";
    var axisDirection = "right";

    _self.horizonWidth = _self.width + _self.margin.left + _self.margin.right;
    _self.horizonHeight = _self.actualheight + _self.margin.top + _self.margin.bottom;

    var majorDimension = _self.majorDimension = _self.horizonHeight;
    var minorDimension = _self.minorDimension = _self.horizonWidth;

    data.sort(function (a, b) {
        if (a[_self.cols[1]] < b[_self.cols[1]]) return 1;
        return -1;
    });

    if (d3.select("#micro" + _self.parentId).empty() || _self.svg.select("rect").empty()) {

        $("#" + _self.parentId).empty();

        console.log("horizon" + _self.horizonHeight);

        var barSize = 40;

        var size = _self.majorDimension / barSize;

        _self.targetData = data;

        _self.svg = d3.select("#" + _self.parentId).append("svg")
            .attr("id", "micro" + _self.parentId)
            .attr("width", _self.horizonWidth)
            .attr("height", _self.horizonHeight);

        _self.opacityScale = d3.scale.linear()
            .range([0.1, 1]);

        _self.opacityScale.domain([0, d3.max(data, function (d) {
            return d[_self.cols[1]];
        })]);

        var bar = _self.svg.selectAll(".high")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            }).enter()
            .append("rect")
            .attr("class", "high")
            .attr("x", function (d, i) {
                if (direction == "left" || direction == "right")
                    return 0;

                if (direction == "top" || direction == "bottom")
                    return i * barSize;

            })
            .attr("y", function (d, i) {

                if (direction == "left" || direction == "right")
                    return 20 + i * barSize;

                if (direction == "top" || direction == "bottom")
                    return 0;

            })
            .attr("height", function (d) {
                if (direction == "left" || direction == "right")
                    return barSize - 2;

                if (direction == "top" || direction == "bottom")
                    return _self.minorDimension;

            })
            .attr("width", function (d) {
                if (direction == "left" || direction == "right")
                    return _self.minorDimension;

                if (direction == "top" || direction == "bottom")
                    return barSize - 2;
            })
            .attr("fill", "#9ecae1")
            .attr("fill-opacity", function (d) {
                return _self.opacityScale(d[_self.cols[1]]);
            });

        var text = _self.svg.selectAll(".texthigh")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            }).enter()
            .append("text")
            .attr("class", "texthigh")
            .attr("x", function (d, i) {
                if (direction == "left" || direction == "right")
                    return 5;

                if (direction == "top" || direction == "bottom")
                    return i * barSize;

            })
            .attr("y", function (d, i) {
                if (direction == "left" || direction == "right")
                    return (i + 1) * barSize - 5;

                if (direction == "top" || direction == "bottom")
                    return _self.minorDimension - 5;
            })
            .style("width", barSize - 2)
            .attr("fill", "#222")
            .attr("font-size", "11px")
            .text(function (d) {
                return d[_self.cols[0]];
            });

        var label = _self.svg.selectAll(".label")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            }).enter()
            .append("text")
            .attr("class", "label")
            .attr("x", function (d, i) {
                if (direction == "left" || direction == "right")
                    return 5;

                if (direction == "top" || direction == "bottom")
                    return i * barSize;

            })
            .attr("y", function (d, i) {
                if (direction == "left" || direction == "right")
                    return (i + 1) * barSize + 10;

                if (direction == "top" || direction == "bottom")
                    return _self.minorDimension - 5;
            })
            .style("width", barSize - 2)
            .attr("fill", "#222")
            .attr("font-size", "11px")
            .text(function (d) {
                return _self.myFormat(Math.round(d[_self.cols[1]]));
            });


        _self.svg.append("text")
            .attr("transform", "translate(" + 5 + "," + 10 + ")")
            .text(_self.text)
            .style("font-size", "11px");

    } else {

        _self.svg
            .attr("width", _self.horizonWidth)
            .attr("height", _self.horizonHeight)

        var barSize = 40;

        _self.targetData = data;

        //        _self.opacityScale = d3.scale.linear()
        //            .range([0.1, 1]);
        //

        _self.opacityScale.domain([0, d3.max(data, function (d) {
            return d[_self.cols[1]];
        })]);

        var bar = _self.svg.selectAll(".high")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            });

        bar.exit().transition().duration(duration).attr("fill", "#CCC")
            .attr("fill-opacity", function (d) {
                return 0.01;
            });

        //        bar.enter()
        //            .append("rect")
        //            .transition().delay(1000)
        //            .attr("class", "high")
        //            .attr("x", function (d, i) {
        //                if (direction == "left" || direction == "right")
        //                    return 0;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return i * barSize;
        //
        //            })
        //            .attr("y", function (d, i) {
        //
        //                if (direction == "left" || direction == "right")
        //                    return 10 + i * barSize;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return 0;
        //
        //            })
        //            .attr("height", function (d) {
        //                if (direction == "left" || direction == "right")
        //                    return barSize - 2;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return _self.minorDimension;
        //
        //            })
        //            .attr("width", function (d) {
        //                if (direction == "left" || direction == "right")
        //                    return _self.minorDimension;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return barSize - 2;
        //            })
        //            .attr("fill", "#9ecae1")
        //            .attr("fill-opacity", function (d) {
        //                return _self.opacityScale(d[_self.cols[1]]);
        //            });

        //            .attr("x", function (d, i) {
        //                if (direction == "left" || direction == "right")
        //                    return 0;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return i * barSize;
        //
        //            })
        //            .attr("y", function (d, i) {
        //
        //                if (direction == "left" || direction == "right")
        //                    return 10 + i * barSize;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return 0;
        //
        //            })


        bar.transition().duration(duration).attr("height", function (d) {
                if (direction == "left" || direction == "right")
                    return barSize - 2;

                if (direction == "top" || direction == "bottom")
                    return _self.minorDimension;

            })
            .attr("width", function (d) {
                if (direction == "left" || direction == "right")
                    return _self.minorDimension;

                if (direction == "top" || direction == "bottom")
                    return barSize - 2;
            })
            .attr("fill", "#9ecae1")
            .attr("fill-opacity", function (d) {
                return _self.opacityScale(d[_self.cols[1]]);
            });

        var text = _self.svg.selectAll(".texthigh")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            });

        text.exit().transition().duration(duration).attr("fill", "#CCC");

        //        text.enter()
        //            .append("text")
        //            .transition().duration(500)
        //            .attr("class", "texthigh")
        //            .attr("x", function (d, i) {
        //                if (direction == "left" || direction == "right")
        //                    return 5;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return i * barSize;
        //
        //            })
        //            .attr("y", function (d, i) {
        //                if (direction == "left" || direction == "right")
        //                    return (i + 1) * barSize - 5;
        //
        //                if (direction == "top" || direction == "bottom")
        //                    return _self.minorDimension - 5;
        //            })
        //            .style("width", barSize - 2)
        //            .attr("fill", "#222")
        //            .attr("font-size", "11px")
        //            .text(function (d) {
        //                return d[_self.cols[0]];
        //            });

        text.transition().duration(duration)
            .style("width", barSize - 2)
            .attr("fill", "#222")
            .attr("font-size", "11px")
            .text(function (d) {
                return d[_self.cols[0]];
            });


        var labels = _self.svg.selectAll(".label")
            .data(data, function name(d) {
                return d[_self.cols[0]];
            });

        labels.exit().transition().duration(duration).attr("fill", "white");

        labels.transition().duration(duration)
            .style("width", barSize - 2)
            .attr("fill", "#222")
            .attr("font-size", "11px")
            .text(function (d) {
                return _self.myFormat(Math.round(d[_self.cols[1]]));
            });

    }
}