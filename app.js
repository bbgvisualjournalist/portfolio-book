var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var routes = require('./routes/index');
var config = require('./config')

var app = express();

var fs = require('fs');
var jf = require('jsonfile');

var Tabletop = require('tabletop');
var spreadsheet_URL = config.spreadsheet;

app.locals.analytics = config.analytics;
global.categories = config.categories;

//A simple function for reading files.
function readJSONFile( path ){
	//Check to see if the JSON files exist.
	var binaryData;
	try {
		binaryData = fs.readFileSync( path);
		return JSON.parse( binaryData.toString() );
	} catch (e) {
		if (e.code === 'ENOENT') {
			console.log(path + ' not found!');
			console.log(path + ' needs to be created once before the site will work properly.')
			console.log("(Normally there's about a 1-minute delay.)")

			binaryData = {};
			return binaryData;
		} else {
			throw e;
		} 
	}
}



//var sections = ['site', 'blog', 'portfolio'];
var sections = config.sections;


for (var i = 0; i<sections.length; i++){
	//Use namespaced global variable to keep data that will update. 
	//EXAMPLE: global.freegate = {};
	global[sections[i]] = {};

	//Load data from saved JSON files into global variables.
	//EXAMPLE: global.overview.sitewide = readJSONFile('../data/sitewide.json');
	var filename = '../data/' + sections[i] + '.json'
	global[sections[i]].sitewide = readJSONFile(filename);


	app.locals[sections[i]] = {};
	app.locals[sections[i]].sitewide = readJSONFile(filename);
}


//Toggle for offline use; ignores Google spreadsheet request. Useful for local dev.
var offlineMode=config.offlineMode;


if (!offlineMode){
    //Add a timer to periodically update data for edits.
    //20000 = 20 seconds; 60000 = 1 minute ; 300000 = 5 minutes
    setInterval(fetchData, config.timer);
} else {
    console.log('offlineMode');
}


//Load data from google spreadsheet and write it to JSON files.
function fetchData(){
		console.log('loading spreadsheet data.')

		var myData;
		function onLoad(data, tabletop) {
			console.log("loading, updating and saving data from spreadsheet");

			//Write updated data to .JSON files and update global variables.
			var currentNumber=0;
			function writeJSON(){
				if(currentNumber<sections.length){
					var filename = '../data/' + sections[currentNumber] + '.json'
					
					jf.writeFile(filename, data[sections[currentNumber]].elements, function(err) {
						global[sections[currentNumber]].sitewide = readJSONFile(filename);

						currentNumber++;
						writeJSON();
					})
				}
			}
			writeJSON();
		};

		var options = {
			key: spreadsheet_URL,
			postProcess: function(element) {
				element["timestamp"] = Date.parse( element["date"] );
			},
			callback: onLoad
		};

		Tabletop.init(options);
}







// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message: err.message,
			error: err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message: err.message,
		error: {}
	});
});



module.exports = app;
