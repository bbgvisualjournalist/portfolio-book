var config = {}

//The published google spreadsheet with the data.
config.spreadsheet = 'https://docs.google.com/spreadsheets/d/1qbDmkc5CQ0I14NWclfB0W3AA2EbLObX3ZKXJ8dVc-3o/pubhtml'

//Each sheet in the spreadsheet gets its own .JSON file
config.sections = ['site', 'blog', 'portfolio'];

config.categories = ['illustration', 'animation', 'design'];

//Change for local v. production
config.port = process.env.PORT || '3000';

//Timer for how often to update the JSON data
//20000 = 20 seconds; 60000 = 1 minute ; 300000 = 5 minutes
config.timer = 60000;

//Turn off spreadsheets
config.offlineMode = false;

config.analytics = 'UA-1111111111-1';

module.exports = config;
