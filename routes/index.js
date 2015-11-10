var express = require('express');
var router = express.Router();


/* Splits data into separate paragraphs*/
function splitParagraphs(source){
	var splitGraphs = '';

	var paragraphs = source;
	paragraphs = paragraphs.split('\n')

	for (var i = 0; i<paragraphs.length; i++){
		splitGraphs += '<p>' + paragraphs[i] + '</p>';
	}
	return splitGraphs
}

function createIntro(source, image){
	var photo = '<img src="' + image + '" style="float: left;">';
	var paragraph = '<p>' + photo + source + '</p>';
	return paragraph;
}

/*Used for blog*/
function splitFirstParagraphs(source){
	var splitGraphs = '';

	var paragraphs = source;
	paragraphs = paragraphs.split('\n')

	for (var i = 0; i<2; i++){
		splitGraphs += '<p>' + paragraphs[i] + '</p>';
	}
	return splitGraphs
}

/*Used for metaDescription on projects*/
function firstParagraph(source){
	var paragraphs = source;
	paragraphs = paragraphs.split('\n')
	return paragraphs[0]
}

function capitalizeFirstLetter(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

/* home page */
router.get('/', function(req, res, next) {

	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var projectData;


	var grid = ""

	/*for (var i = portfolioData.length - 1; i >= 0; i--) {*/
	for (var i = 0; i< portfolioData.length; i++) {
		grid +="<a href='/"+ portfolioData[i].projectnumber +"'><div class='square' style='background-image: url(/images/square_" + portfolioData[i].imagebase + ".jpg)'><img src='/images/square_transparent.png'/></div></a>";
	};

	var projectData = portfolioData[1];

	var previousProjectNumber = "/1011";
	var nextProjectNumber = "/1000";

	projectData.descriptionSplit = splitParagraphs(projectData.description);

	var currentCategory = projectData.category;

	var verticalImage = '';
	if (projectData.verticalimage == 'TRUE'){
		verticalImage = 'verticalImage';
	}

	var pageTitle = projectData.title;

	var metaImage = data[0].url + '/images/' + projectData.imagebase + '.jpg';
	var url = data[0].url + '/';
	var metaDescription = firstParagraph(projectData.description)

	res.render('index', {
		data: data,
		projectData: projectData,
		pageTitle: pageTitle,
		portfolioDescription: data[0][currentCategory],
		verticalImage: verticalImage,
		category: 'showAll',
		metaImage: metaImage,
		metaDescription: metaDescription,
		url: url,
		loopLimit: 3,
		nextProject: nextProjectNumber,
		previousProject: previousProjectNumber,
		grid: grid,
		intro: splitParagraphs(data[0].introduction),
		introDetail: data[0].introdetail,
		introTitle: data[0].introtitle,
		introSummary: data[0].introsummary,
		description: data[0].biography
	});
});


/* GET dummy page. Show all. */
router.get('/dummy/', function(req, res, next) {
	res.render('storyboard', { 
		pageTitle: "Brian Williamson’s portfolio",
		storyboardSpreadsheetUrl: '1QOqxqfaEPLDlvpNDnn_cqrLzJQMyQLDlg7gdvfPf1Vo'
	});
});


/* GET illustration number. */
router.get('/:number', function(req, res, next) {
	var featuredNumber = req.params.number;

	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var projectData;
	var previousProjectNumber;
	var nextProjectNumber;

	for (var k=0; k<portfolioData.length; k++){
		if(portfolioData[k].projectnumber==featuredNumber){
			projectData = portfolioData[k];


			//Define the previous project number;
			if(k == 0){
				previousProjectNumber = "\\";
			} else {
				previousProjectNumber = "\\" + portfolioData[k - 1].projectnumber;
			}
			//Define the next project number
			if(k == portfolioData.length - 1){
				nextProjectNumber = "\\";
			}else{
				nextProjectNumber = "\\" + portfolioData[k + 1].projectnumber;
			}
		}
	}

	projectData.descriptionSplit = splitParagraphs(projectData.description);

	var currentCategory = projectData.category;

	var verticalImage = '';
	if (projectData.verticalimage == 'TRUE'){
		verticalImage = 'verticalImage';
	}

	var pageTitle = projectData.title;

	var promos = [];
	for (k=0; k<portfolioData.length; k++){
		if(portfolioData[k].category==currentCategory&&portfolioData[k].projectnumber!=featuredNumber){
			promos.push(portfolioData[k]);
		}
	}
	var metaImage = data[0].url + '/images/' + projectData.imagebase + '.jpg';
	var url = data[0].url + '/project/' + featuredNumber;
	var metaDescription = firstParagraph(projectData.description)

	/*description: splitParagraphs(data[0].biography)*/
	res.render('illustration', {
		data: data,
		portfolioData: promos,
		projectData: projectData,
		pageTitle: pageTitle,
		portfolioDescription: data[0][currentCategory],
		featuredNumber: featuredNumber,
		verticalImage: verticalImage,
		category: 'showAll',
		metaImage: metaImage,
		metaDescription: metaDescription,
		url: url,
		loopLimit: 3,
		nextProject: nextProjectNumber,
		previousProject: previousProjectNumber,
		description: data[0].biography
	});
})









/* GET portfolio page. Show all. */
router.get('/portfolio/', function(req, res, next) {
	var featuredNumber = req.query.number;

	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var url = data[0].url + '/portfolio/';


	res.render('portfolio', { 
		data: data,
		pageTitle: "Brian Williamson’s portfolio",
		portfolioData: portfolioData,
		portfolioDescription: '',
		featuredNumber: featuredNumber,
		category: 'showAll',
		metaImage: data[0].metaimage,
		url: url,
		loopLimit: portfolioData.length,
		description: data[0].biography
	});
});


/* GET blog list. */
router.get('/blog/', function(req, res, next) {
	var data = global.site.sitewide;
	var blogData = global.blog.sitewide;

	for (var j=0; j<blogData.length; j++){
		var splitPost = splitFirstParagraphs(blogData[j].post);
		blogData[j].postSplit = splitPost;
	}
	var url = data[0].url + '/blog/';

	var portfolioData = global.portfolio.sitewide;


	res.render('blog', { 
		data: data,
		blogData: blogData,
		portfolioData: portfolioData,
		category: 'showAll',
		pageTitle: 'Blog',
		loopLimit: 18,
		portfolioDescription: '',
		metaImage: data[0].metaimage,
		url: url,
		description: data[0].blog
	});
});

/* GET blog post. */
router.get('/blog/:number/', function(req, res, next) {
	var featuredNumber = req.params.number;

	var data = global.site.sitewide;
	var blogData = global.blog.sitewide;
	var blogPostData;
	var currentCategory;
	for (var k=0; k<blogData.length; k++){
		if(blogData[k].postnumber==featuredNumber){
			blogPostData = blogData[k];
			blogPostData.descriptionSplit = splitParagraphs(blogPostData.post);
			currentCategory = blogPostData.category;
		}
	}
	var verticalImage = '';
	if (blogPostData.verticalimage == 'TRUE'){
		verticalImage = 'verticalImage';
	}

	var pageTitle = blogPostData.title;
	var metaImage = data[0].url + blogPostData.imagebase;
	var url = data[0].url + '/blog/' + featuredNumber;



	res.render('blogpost', { 
		data: data,
		projectData: blogPostData,
		pageTitle: pageTitle,
		portfolioDescription: '',
		featuredNumber: featuredNumber,
		verticalImage: verticalImage,
		category: 'showAll',
		metaImage: metaImage,
		url: url,
		loopLimit: 3,
		description: data[0].blog
	});
});


module.exports = router;