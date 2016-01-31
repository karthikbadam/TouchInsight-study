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

var gross_time, genre_gross, gross_budget, genre_budget, director_gross;

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
    
    //send default query to server
    var _self = this;

    $.ajax({

        type: "GET",
        url: "/getMovies",
        data: {
            data: [query]
        }
        
    }).done(function (data) {
        
        data = JSON.parse(data);
        
        console.log(data.length);
        
        gross_budget.updateVisualization(data);
        
        processByYear(data);
        
        processByGenre(data); 
        
    });

});


function average (arr) {
	return arr.reduce(function(memo, num)
	{
		return memo + num;
	}, 0) / arr.length;
}


function processByYear (data) {
       
    var newData = {};
    
    data.forEach(function (d) {
       
        var cdate = new Date(d["_id"][date]);
        var cyear = cdate.getFullYear();
        
        if (cyear > 2011) {
            cyear = cyear-100;
        }
        
        if (cyear in newData) {
            newData[cyear][gross].push(d["_id"][gross]);
            newData[cyear][budget].push(d["_id"][budget]);
        
        } else {
        
            newData[cyear] = {};
            newData[cyear][gross] = [];
            newData[cyear][budget] = [];
        }
    });
    
    Object.keys(newData).forEach(function (k) {
        
        if (newData[k][gross].length == 0 || newData[k][budget].length == 0) {
            delete newData[k];
            return;
        }
        
        var avgGross = average(newData[k][gross]);
        var avgBudget = average(newData[k][budget]);
        
        newData[k]["avg_"+gross] = avgGross;
        newData[k]["avg_"+budget] = avgBudget;
        
    });
    
    console.log(newData);
    
    return newData;
    
}

function processByGenre (data) {
 
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
    
    Object.keys(newData).forEach(function (k) {
        
        if (newData[k][gross].length == 0 || newData[k][budget].length == 0) {
            delete newData[k];
            return;
        }
        
        var avgGross = average(newData[k][gross]);
        var avgBudget = average(newData[k][budget]);
        
        newData[k]["avg_"+gross] = avgGross;
        newData[k]["avg_"+budget] = avgBudget;
        
    });
    
    return newData;
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
//    gross_time = new TimeChart({
//        parentId: "topDiv",
//        cols: [date, gross],
//        width: $("#topDiv").width(),
//        height: $("#topDiv").height(),
//    });
//
//    genre_gross = new BarChart({
//        parentId: "leftDiv",
//        cols: [genre, gross],
//        width: $("#leftDiv").width(),
//        height: $("#leftDiv").height(),
//    });

    gross_budget = new ScatterPlot({
        parentId: "mainDiv",
        cols: [budget, gross],
        width: $("#mainDiv").width(),
        height: $("#mainDiv").height(),
    });

//    genre_budget = new Parallel({
//        parentId: "rightDiv",
//        cols: [genre, budget],
//        width: $("#rightDiv").width(),
//        height: $("#rightDiv").height(),
//    });
//
//    director_gross = new BarChart({
//        parentId: "bottomDiv",
//        cols: [director, gross],
//        width: $("#bottomDiv").width(),
//        height: $("#bottomDiv").height(),
//    });

}