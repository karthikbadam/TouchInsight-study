var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var csv = require('fast-csv');
var fs = require('fs');
var d3 = require('d3');
var url = require('url');
var qs = require('qs');

var parseDate = d3.time.format("%d-%b-%y").parse;
var parseYear = d3.time.format("%Y").parse;

//var citiesToLoc = require('./maps.js').citiesToLoc;

//var routes = require('./routes/index');
//var users = require('./routes/users');

// connecting to Mongodb database running instance
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;

var FIRST_TIME_EXECUTED = false;

// connect to the flights database in mongodb
//var mongourl = 'mongodb://127.0.0.1:27017/flights';
var mongourl = 'mongodb://127.0.0.1:27017/movies';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// Change from Default: html rendering engine 
app.engine('html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Change from Default:  Instead of routes and users 
app.get('/', function (req, res, next) {
    res.render('largedisplay.html', {});
});

app.get('/mobile1', function (req, res, next) {
    res.render('mobile1.html', {});
});

app.get('/mobile2', function (req, res, next) {
    res.render('mobile2.html', {});
});

app.get('/mobile3', function (req, res, next) {
    res.render('mobile3.html', {});
});

app.get('/study', function (req, res, next) {
    res.render('data.html', {});
});

var gross = "Worldwide_Gross";
var ratings = "IMDB_Rating";
var budget = "Production_Budget";
var date = "Release_Date";
var director = "Director";
var genre = "Major_Genre";

function initialize(db, callback) {
    if (FIRST_TIME_EXECUTED) {

        var obj;
        fs.readFile("public/data/movies.json", 'utf8', function (err, data) {
            if (err) throw err;
            obj = JSON.parse(data);

            for (var i = 0; i < obj.length; i++) {
                var d = obj[i];

                var temp = {};
                temp[gross] = +d[gross];
                temp[ratings] = +d[ratings];
                temp[budget] = +d[budget];
                if (("" + d[date]).split("-").length == 3) {
                    temp[date] = "" + parseDate(d[date]);
                } else {
                    temp[date] = "" + parseYear(("" + d[date]));
                }
                temp[director] = d[director];
                temp[genre] = d[genre];

                console.log(temp);

                //add to database
                db.collection('movies')
                    .insertOne(temp,
                        function (err, result) {
                            assert.equal(err, null);
                        });
            }
        });

    }
}


// get all data based on a query of specific dimensions

function queryMovies(db, query, callback) {

    var data = db.collection("movies")
        .aggregate([
            {
                $match: query
        },
            {
                $group: {
                    "_id": {
                        gross: "$Worldwide_Gross", 
                        ratings: "$IMDB_Rating",
                        budget: "$Production_Budget",
                        date: "$Release_Date",
                        director: "$Director",
                        genre: "$Major_Genre";
                    },
                    "Worldwide_Gross": {
                        $sum: "$Worldwide_Gross"
                    }
                }
        },{
                $sort: {
                    "Worldwide_Gross": -1
                }
        }
    ]);


    data.toArray(function (err, docs) {
        assert.equal(null, err);
        console.log(docs.length);
        callback(docs);
    });

}

app.get('/getMovies', function (req, res, next) {

    var params = url.parse(req.url, true).query;

    var query = parseQueryString(params);

    MongoClient.connect(mongourl, function (err, db) {
        assert.equal(null, err);

        queryMovies(db, query,
            function (data) {
                db.close();
                res.write(JSON.stringify(data));
                res.end();
            });
    });

});


MongoClient.connect(mongourl, function (err, db) {
    assert.equal(null, err);
    initialize(db, function () {
        db.close();
    });
});


// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;