var gross = "Worldwide_Gross";
var ratings = "IMDB_Rating";
var budget = "Production_Budget";
var date = "Release_Date";
var director = "Director";
var genre = "Major_Genre";

var device = 0;

var width = 0;

var height = 0;

var PADDING = 5;

var device = "DESKTOP";

var parseDate = d3.time.format("%d-%b-%y").parse;

var queryStack = [];

var historyQueryStack = [];

var touchSync;

var top, left, right, bottom, main;

var gross_time, genre_gross, gross_budget, genre_budget, budget_time;

var month_names_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

var interactions = [{
    query: [{
        index: budget,
        value: [60000000, 320000000],
        operator: "range",
        logic: "CLEAN"
    }, {
        index: gross,
        value: [30000000, 3000000000],
        operator: "range",
        logic: "AND"

    }]
}];


function setGlobalQuery(query, propagate) {

    var currQuery = query;

    var prevQuery = queryStack[queryStack.length - 1];

    //    if (prevQuery && prevQuery.logic== "AND" && prevQuery.index == query.index) {
    //        query.logic = "OR";   
    //        prevQuery.logic = "OR"; 
    //        queryStack[queryStack.length -  1] = prevQuery;
    //
    //    }

    queryStack.push(query.getQueryString());

    for (var i = queryStack.length - 1; i >= 0; i--) {

        var q = queryStack[i];

        if (q.logic == "CLEAN") {

            queryStack = queryStack.slice(i);
            break;
        }
    }

    touchSync.push(currQuery);

    d3.selectAll(".extent").attr("width", 0).attr("x", 0);

    historyQueryStack.push(query);

    // update all other visualizations
    if (propagate) {
        geomap.postUpdate();
        timechart.postUpdate();
        passengerchart.postUpdate();
        flightsbar.postUpdate();
        passengersbar.postUpdate();
        flightdistance.postUpdate();
        passengerseats.postUpdate();
        distancebar.postUpdate();
        populationbar.postUpdate();
    }

}


function clearAllQueries() {
    if (queryStack.length == 0)
        return;

    queryStack.length = 0;

    // context switched
    var content = {};
    content.action = "CLEAR";
    //content.mainview = mainView;
    touchSync.push(content);

    var query = new Query({
        index: "Date",
        value: ["1990", "2009"],
        operator: "range",
        logic: "CLEAN"
    });

    setGlobalQuery(query, 1);
}

function clearRecentQuery() {
    if (queryStack.length == 0)
        return;

    if (queryStack.length == 1)
        clearAllQueries();

    queryStack.pop();
    historyQueryStack.pop();

    // context switched
    var content = {};
    content.action = "UNDO";
    //content.mainview = mainView;
    touchSync.push(content);

    // update all other visualizations
    geomap.postUpdate();
    timechart.postUpdate();
    passengerchart.postUpdate();
    flightsbar.postUpdate();
    passengersbar.postUpdate();
    flightdistance.postUpdate();
    passengerseats.postUpdate();
    distancebar.postUpdate();
    populationbar.postUpdate();

}

$(document).ready(function () {

    //creating the layout
    width = $("#content").width();
    height = $("#content").height();

    createLayout();

    onDataLoaded();

    var query = {
        index1: budget,
        operator1: "all",
        value: "",
        logic: "CLEAN",
        index2: gross,
        operator2: "all",
        value: "",
    };
    
    createVisualizationfromQueryList ([query]);
    
    var delay=2000; //1 seconds

    setTimeout(function(){
      createVisualizationfromQueryList (interactions[0].query);
    }, delay); 
    
    
    

});

function createVisualizationfromQueryList (queryList) {
    
    $.ajax({

        type: "GET",
        url: "/getMovies",
        data: {
            data: queryList
        }

    }).done(function (data) {

        data = JSON.parse(data);

        console.log(data.length);

        gross_budget.updateVisualization(data);

        processByYear(data);

        var dataByGenre = processByGenre(data);

        var dataByTime = processByYear(data);

        genre_gross.updateVisualization(dataByGenre);

        genre_budget.updateVisualization(dataByGenre);

        gross_time.updateVisualization(dataByTime);

        budget_time.updateVisualization(dataByTime);

    });
    
}



function average(arr) {
    return arr.reduce(function (memo, num) {
        return memo + num;
    }, 0) / arr.length;
}


function processByYear(data) {

    var newData = {};

    data.forEach(function (d) {

        var cdate = new Date(d["_id"][date]);
        var cyear = cdate.getFullYear();
        var cmonth = month_names_short[cdate.getMonth()];

        if (cyear > 2011) {
            cyear = cyear - 100;
        }

        cdate = cmonth + "/" + cyear;

        if (cdate in newData) {
            newData[cdate][gross].push(d["_id"][gross]);
            newData[cdate][budget].push(d["_id"][budget]);

        } else {

            newData[cdate] = {};
            newData[cdate][gross] = [];
            newData[cdate][budget] = [];
        }
    });

    var returnData = [];

    Object.keys(newData).forEach(function (k) {

        var datum = {};
        datum[date] = k;

        if (k == "undefined/NaN")
            return;

        if (newData[k][gross].length == 0 || newData[k][budget].length == 0) {
            delete newData[k];
            return;
        }

        var avgGross = average(newData[k][gross]);
        var avgBudget = average(newData[k][budget]);

        datum["avg_" + gross] = avgGross;
        datum["avg_" + budget] = avgBudget;
        datum['dist_' + gross] = newData[k][gross];
        datum['dist_' + budget] = newData[k][budget];

        returnData.push(datum);

    });

    return returnData;

}

function processByGenre(data) {

    var newData = {};

    data.forEach(function (d) {

        if (d["_id"][genre] in newData) {
            newData[d["_id"][genre]][gross].push(d["_id"][gross]);
            newData[d["_id"][genre]][budget].push(d["_id"][budget]);

        } else {

            newData[d["_id"][genre]] = {};
            newData[d["_id"][genre]][gross] = [];
            newData[d["_id"][genre]][budget] = [];
        }
    });

    var returnData = [];

    Object.keys(newData).forEach(function (k) {

        var datum = {};
        datum[genre] = k;

        if (newData[k][gross].length == 0 || newData[k][budget].length == 0) {
            delete newData[k];
            return;
        }

        var avgGross = average(newData[k][gross]);
        var avgBudget = average(newData[k][budget]);

        datum["avg_" + gross] = avgGross;
        datum["avg_" + budget] = avgBudget;
        datum['dist_' + gross] = newData[k][gross];
        datum['dist_' + budget] = newData[k][budget];

        returnData.push(datum);

    });

    return returnData;
}

function createLayout() {

    top = d3.select("#content").append("div")
        .attr("id", "topDiv")
        .attr("class", "panel")
        .style("width", 2 * width / 3)
        .style("height", height / 4 - 2)
        .style("background-color", "white")
        .style("overflow", "hidden")
        .style("margin-left", width / 6);

    left = d3.select("#content").append("div")
        .attr("id", "leftDiv")
        .attr("class", "panel")
        .style("width", width / 3 - 2)
        .style("height", height / 2 - 2)
        .style("background-color", "white")
        .style("overflow", "hidden");

    main = d3.select("#content").append("div")
        .attr("id", "mainDiv")
        .attr("class", "panel")
        .style("width", width / 3 - 2)
        .style("height", height / 2 - 2)
        .style("background-color", "white")
        .style("overflow", "hidden");

    right = d3.select("#content").append("div")
        .attr("id", "rightDiv")
        .attr("class", "panel")
        .style("width", width / 3 - 2)
        .style("height", height / 2 - 2)
        .style("background-color", "white")
        .style("overflow", "hidden");

    bottom = d3.select("#content").append("div")
        .attr("id", "bottomDiv")
        .attr("class", "panel")
        .style("width", 2 * width / 3)
        .style("height", height / 4 - 2)
        .style("background-color", "white")
        .style("overflow", "hidden")
        .style("margin-left", width / 6);

}

function onDataLoaded() {

    //creating the views
    gross_time = new TimeChart({
        parentId: "topDiv",
        cols: [date, "avg_" + gross],
        width: $("#topDiv").width(),
        height: $("#topDiv").height(),
        text: "Avg. Gross by Time"
    });

    genre_gross = new Bar({
        parentId: "leftDiv",
        cols: [genre, "avg_" + gross],
        width: $("#leftDiv").width(),
        height: $("#leftDiv").height(),
        text: "Avg. Gross by Genre"
    });

    gross_budget = new ScatterPlot({
        parentId: "mainDiv",
        cols: [budget, gross],
        width: $("#mainDiv").width(),
        height: $("#mainDiv").height(),
    });

    genre_budget = new Bar({
        parentId: "rightDiv",
        cols: [genre, "avg_" + budget],
        width: $("#rightDiv").width(),
        height: $("#rightDiv").height(),
        text: "Avg. Budget by Genre"
    });

    budget_time = new TimeChart({
        parentId: "bottomDiv",
        cols: [date, "avg_" + budget],
        width: $("#bottomDiv").width(),
        height: $("#bottomDiv").height(),
        text: "Avg. Budget by Time"
    });

}