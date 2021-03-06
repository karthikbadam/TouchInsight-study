var interactions = interactions3;

var gross = "Worldwide_Gross";
var ratings = "IMDB_Rating";
var budget = "Production_Budget";
var date = "Release_Date";
var director = "Director";
var genre = "Major_Genre";

var index = 0;

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

var recordings = {};

var currentTask = 1;

function playAfterCountdown(q) {
    // enable panel
    var delay = 750; //1 seconds

    setTimeout(function () {
        d3.select("#count-down").style("background-image", "url('/images/two.png')");

        setTimeout(function () {
            d3.select("#count-down").style("background-image", "url('/images/one.png')");

            setTimeout(function () {

                d3.select("#count-down").style("display", "none");

                setTimeout(function () {

                    createVisualizationfromQueryList(q, 1000);
                    
                }, delay);

            }, delay);

        }, delay);

    }, delay);

}

var answer = 0;

function playInteractions(currentTask) {

    var dialog = d3.select("#dialog");
    

    // add new task description
    d3.select("#task-text").select("text").remove();
    d3.select("#task-text").append("text").text(currentTask + ": "+ interactions[currentTask].query[0].text);
    
    d3.select("#false-button").style("background-color", "transparent");
    d3.select("#true-button").style("background-color", "transparent");
    

    dialog.select("#button-panel").select("#play-button")
        .on("click", function () {
        
            attempts++;
        
            // make sure the content is back to default
            createVisualizationfromQueryList(interactions[0].query, 0);

            // disable the panel
            dialog.style("display", "none");

            //start countdown
            d3.select("#count-down").style("display", "block");

            // play animation
            playAfterCountdown(interactions[currentTask].query);

            // enable panel
            var delay = 5000; //1 seconds

            setTimeout(function () {
                d3.select("#count-down")
                    .style("background-image", "url('/images/three.png')");
                dialog.style("display", "block");
                
            }, delay);

        });
    
    
    // true false
    d3.select("#true-button").on("click", function () {
        answer = 1;
         d3.select("#false-button").style("background-color", "transparent");
         d3.select("#true-button").style("background-color", "rgb(158, 202, 225)");
        
    });
    
    d3.select("#false-button").on("click", function () {
        answer = 0;
         d3.select("#true-button").style("background-color", "transparent");
         d3.select("#false-button").style("background-color", "rgb(158, 202, 225)");
        
    });
    
    d3.select("#next-button").on("click", function () {
        
        var log = {};
        
        log.query = interactions[0].query;
        log.timing = Date.now() - startTime;
        log.attempts = attempts;
        log.answer = answer;
        log.actual = interactions[currentTask].query[0].answer;
        
        recordings[currentTask] = log;
        
        //restart
        startTime = Date.now();  
        attempts = 0;
            
        createVisualizationfromQueryList(interactions[0].query, 0);
        
        currentTask++;
        
        if (currentTask == interactions.length ) {
         
            console.log(recordings);
            
            touchSync.push(recordings);
            
            dialog.style("display", "none");
            
            return;
        }
        
        playInteractions(currentTask);
        
    });
    
     d3.select("#previous-button").on("click", function () {
         
        if (currentTask == 0) 
            return;
         
        //restart
        startTime = Date.now();  
        attempts = 0;
          
        createVisualizationfromQueryList(interactions[0].query, 0);
         
        currentTask--;
        playInteractions(currentTask);
        
    });
}

var startTime = Date.now();
var attempts = 0;

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

    createVisualizationfromQueryList(interactions[0].query, 0);
    
    playInteractions(1);
    
    touchSync = new Sync({});

});


function createDelay(index) {
    var delay = 2000; //1 seconds

    setTimeout(function () {
        createVisualizationfromQueryList(interactions[index].query);
        if (index < interactions.length - 1) {
            //createDelay(index + 1);
        }

    }, delay);


}

function createVisualizationfromQueryList(queryList, duration) {

    $.ajax({

        type: "GET",
        url: "/getMovies",
        data: {
            data: queryList
        }

    }).done(function (data) {
        
        if (duration == null) {
            duration = 0;   
        }

        data = JSON.parse(data);

        console.log(data);

        gross_budget.updateVisualization(data);

        processByYear(data);

        var dataByGenre = processByGenre(data);

        var dataByTime = processByYear(data);

        genre_gross.updateVisualization(dataByGenre, duration);

        genre_budget.updateVisualization(dataByGenre, duration);

        gross_time.updateVisualization(dataByTime, duration);

        budget_time.updateVisualization(dataByTime, duration);

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

        //cdate = cmonth + "/" + cyear;
        cdate = "" + cyear;

        if (cdate in newData) {
            newData[cdate][gross].push(d["_id"][gross]);
            newData[cdate][budget].push(d["_id"][budget]);

        } else {

            newData[cdate] = {};
            newData[cdate][gross] = [];
            newData[cdate][budget] = [];
            newData[cdate][gross].push(d["_id"][gross]);
            newData[cdate][budget].push(d["_id"][budget]);
        }
    });

    var returnData = [];

    Object.keys(newData).forEach(function (k) {

        var datum = {};
        datum[date] = k;

        if (k == "undefined/NaN" || k == "NaN")
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

    if (returnData.length == 1) {
        var newDatum = {};

        newDatum[date] = "" + (+returnData[0][date] - 1);
        newDatum["avg_" + gross] = 0;
        newDatum["avg_" + budget] = 0;

        returnData.push(newDatum);
    }

    console.log(returnData);
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
            newData[d["_id"][genre]][gross].push(d["_id"][gross]);
            newData[d["_id"][genre]][budget].push(d["_id"][budget]);
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


    console.log(returnData);
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