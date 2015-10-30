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


/* GET home page. */
router.get('/', function(req, res, next) {
	var featuredNumber = 0;
	if (req.query.number!=null){
		featuredNumber = req.query.number;
	};


	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;


	//Select a random 'recent' project. Recent is defined as the most recent half of the portfolio.
    //!!!Need to check that the project is public.
	//var randomProjectNumber = Math.floor(portfolioData.length*Math.random());
	var randomProjectNumber = Math.floor( (portfolioData.length/2) * Math.random()) + (portfolioData.length/2);

	var projectData = portfolioData[randomProjectNumber];
    projectData.descriptionSplit = splitParagraphs(projectData.description);
	var currentCategory = projectData.category;

	var verticalImage = '';
	if (projectData.verticalimage == 'TRUE'){
		verticalImage = 'verticalImage';
	}


	var promos = [];
	for (k=0; k<portfolioData.length; k++){
		if(portfolioData[k].projectnumber!=portfolioData[randomProjectNumber].projectnumber){
			promos.push(portfolioData[k]);
		}
	}

	var url = data[0].url;

	//description: splitParagraphs(data[0].biography)

	res.render('index', { 
		data: data,
		pageTitle: "Brian Williamson's portfolio",
		portfolioData: promos,
		portfolioDescription: '',
		projectData: projectData,
		verticalImage: verticalImage,
		featuredNumber: featuredNumber,
		category: 'showAll',
		metaImage: data[0].metaimage,
		url: url,
		loopLimit: 6,
		description: data[0].biography
	});
	//description: createIntro(data[0].biography, data[0].mugshot)
});


/* GET about page. */
router.get('/about', function(req, res, next) {
	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var url = data[0].url + '/about/';


	res.render('about', { 
		data: data,
		pageTitle: 'About',
		portfolioData: portfolioData,
		portfolioDescription: '',
		url: url,
		description: data[0].biography
	});
});


/* GET portfolio page. Show all. */
router.get('/portfolio/', function(req, res, next) {
	var featuredNumber = req.query.number;

	var data = global.site.sitewide;
	var portfolioData = global.portfolio.sitewide;
	var url = data[0].url + '/portfolio/';


	res.render('portfolio', { 
		data: data,
		pageTitle: "Brian Williamson's portfolio",
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

/* GET portfolio page. Show all. */
router.get('/illustration/:number/', function(req, res, next) {
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
                previousProjectNumber = portfolioData[portfolioData.length - 1].projectnumber;
            } else {
                previousProjectNumber = portfolioData[k - 1].projectnumber;
            }
            //Define the next project number
            if(k == portfolioData.length - 1){
                nextProjectNumber = portfolioData[0].projectnumber;
            }else{
                nextProjectNumber = portfolioData[k + 1].projectnumber;
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
        description: data[0][currentCategory]
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