var gross = "Worldwide_Gross";
var ratings = "IMDB_Rating";
var budget = "Production_Budget";
var date = "Release_Date";
var director = "Director";
var genre = "Major_Genre";

var interactions1 = [
    {
        query: [{
            index: budget,
            value: [0, 300000000],
            operator: "range",
            logic: "CLEAN",
        }]
    },

    {
        query: [{
            index: budget,
            value: [20000000, 300000000],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Budget trend between Romantic Comedy and Horror genres is opposite to default.",
            answer: 1
        }, {
            index: gross,
            value: [200000000, 3000000000],
            operator: "range",
            logic: "AND"
        }]
    }, 
    
    {
        query: [{
            index: ratings,
            value: [8, 10],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Gross values for years 1972 and 2009 are higher compared to default.",
            answer: 1
        }]    
    }, 
    
    {
        query: [{
            index: ratings,
            value: [0, 4],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Gross from Musical and Action genre movies is lower than default.",
            answer: 0
        }]
    }, 
    
    {
        query: [{
            index: gross,
            value: [30000000, 1000000000],
            operator: "range",
            logic: "CLEAN",
            text: "There is a trend reversal for Avg. Budget after 2008 compared to default.",
            answer: 1
        }, {
            index: budget,
            value: [100000000, 300000000],
            operator: "range",
            logic: "AND"
        }]
    }, 
    
    {
        query: [{
            index: ratings,
            value: [2, 5, 10],
            operator: "in",
            logic: "CLEAN",
            text: "The Avg. Budget on Thriller/Suspense and Documentaries is lower than default.",
            answer: 1
        }]
    }, 
    
    {
        query: [{
            index: director,
            value: ["Martin Scorsese", "Christopher Nolan"],
            operator: "in",
            logic: "CLEAN",
            text: "The Avg. Gross is consistently higher than default since 1991.",
            answer: 0
        }]
    }, 
    
    {
        query: [{
            index: director,
            value: ["Woody Allen"],
            operator: "in",
            logic: "CLEAN",
            text: "The Avg. Gross for Thriller/Suspense and Musical movies is higher than default ",
            answer: 0
        }]
    }, 
    
    {
        query: [{
            index: "Rotten_Tomatoes_Rating",
            value: [75, 100],
            operator: "range",
            logic: "CLEAN",
            text: "The trend in Avg. Budget between 2001 and 2008 is the same as default.",
            answer: 1
        }]
    }
];



var interactions2 = [
    {
        query: [{
            index: budget,
            value: [0, 300000000],
            operator: "range",
            logic: "CLEAN",
        }]
    }, 
    
    {
        query: [{
            index: ratings,
            value: [5, 6],
            operator: "range",
            logic: "CLEAN",
            text: "The peaks in Avg. Gross over time are higher than the default.",
            answer: 0
        }]    
    }, 
    
    {
        query: [{
            index: ratings,
            value: [0, 3],
            operator: "range",
            logic: "CLEAN",
            text: "There is a trend reversal for Avg. Budget between Action and Musical compared to default.",
            answer: 1
        }]
    },

    {
        query: [{
            index: budget,
            value: [10000000, 200000000],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Budget trend between years 1996 and 2010 is opposite to default.",
            answer: 0
        }, {
            index: gross,
            value: [100000000, 2000000000],
            operator: "range",
            logic: "AND"
        }]
    }, 
    
    {
        query: [{
            index: budget,
            value: [100000000, 300000000],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Budget for Romantic Comedy and Adventure is lower than default.",
            answer: 1
        }]
    }, 
    
    {
        query: [{
            index: ratings,
            value: [4, 5, 6],
            operator: "in",
            logic: "CLEAN",
            text: "The Avg. Gross between 1990 and 1994 is higher than default.",
            answer: 0
        }]
    }, 
    
    {
        query: [{
            index: director,
            value: ["Woody Allen"],
            operator: "in",
            logic: "CLEAN",
            text: "There is a trend reversal for Avg. Budget between Thriller/Suspense and Musical compared to default.",
            answer: 1
        }]
    }, 
    
    {
        query: [{
            index: director,
            value: ["Martin Scorsese"],
            operator: "in",
            logic: "CLEAN",
            text: "The Avg. Budget is consistently higher than default between 1990 and 1996.",
            answer: 0
        }]
    }, 
    
    {
        query: [{
            index: "Rotten_Tomatoes_Rating",
            value: [25, 30],
            operator: "range",
            logic: "CLEAN",
            text: "There is a trend reversal for Avg. Gross between Comedy and Horror compared to default.",
            answer: 1
        }]
    }
];


var interactions3 = [
    {
        query: [{
            index: budget,
            value: [0, 300000000],
            operator: "range",
            logic: "CLEAN",
        }]
    }, 
    
    {
        query: [{
            index: ratings,
            value: [1, 5],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Gross for Musical and Drama are higher than the default.",
            answer: 0
        }]    
    }, 
    
    {
        query: [{
            index: ratings,
            value: [7, 10],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Budget trend between years 1996 and 2008 is the same as default.",
            answer: 1
        }]
    }, 
    
    {
        query: [{
            index: budget,
            value: [100000000, 300000000],
            operator: "range",
            logic: "CLEAN",
            text: "There is a trend reversal for Avg. Budget between Action and Drama compared to default.",
            answer: 0
        }]
    },

    {
        query: [{
            index: budget,
            value: [20000000, 100000000],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Gross peak shifted to 1980 from 1937 in default.",
            answer: 1
        }, {
            index: gross,
            value: [100000000, 2000000000],
            operator: "range",
            logic: "AND"
        }]
    }, 
    
    {
        query: [{
            index: director,
            value: ["Woody Allen"],
            operator: "in",
            logic: "CLEAN",
            text: "There Avg. Budget for Thriller/Suspense and Musical is higher than default.",
            answer: 1
        }]
    }, 
    
    {
        query: [{
            index: ratings,
            value: [6, 7],
            operator: "range",
            logic: "CLEAN",
            text: "The trend in Avg. Budget between 2000 and 2008 is similar to default.",
            answer: 0
        }]
    }, 
    
    {
        query: [{
            index: director,
            value: ["Martin Scorsese"],
            operator: "in",
            logic: "CLEAN",
            text: "The Avg. Gross for Drama and Black Comedy is higher than default.",
            answer: 0
        }]
    }, 
    
    {
        query: [{
            index: "Rotten_Tomatoes_Rating",
            value: [25, 30],
            operator: "range",
            logic: "CLEAN",
            text: "There is a trend reversal for Avg. Gross between 1990 and 1994 compared to default.",
            answer: 1
        }]
    }
];


var interactions0 = [
    {
        query: [{
            index: budget,
            value: [0, 300000000],
            operator: "range",
            logic: "CLEAN",
        }]
    }, 
    
    {
        query: [{
            index: ratings,
            value: [3, 5],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Gross for Musical are higher than the default.",
            answer: 0
        }]    
    }, 
    
    {
        query: [{
            index: ratings,
            value: [8, 10],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Budget trend between years 2000 and 2008 is the same as default.",
            answer: 1
        }]
    }, 
    
    {
        query: [{
            index: budget,
            value: [20000000, 100000000],
            operator: "range",
            logic: "CLEAN",
            text: "There is a trend reversal for Avg. Budget between Action and Comedy compared to default.",
            answer: 0
        }]
    },

    {
        query: [{
            index: budget,
            value: [20000000, 100000000],
            operator: "range",
            logic: "CLEAN",
            text: "The Avg. Gross increased for all genres.",
            answer: 1
        }, {
            index: gross,
            value: [100000000, 2000000000],
            operator: "range",
            logic: "AND"
        }]
    }, 
    
    {
        query: [{
            index: director,
            value: ["Woody Allen"],
            operator: "in",
            logic: "CLEAN",
            text: "There Avg. Gross trend between 1996 and 2002 is similar to default.",
            answer: 1
        }]
    }
];