//Quickly turn console logging on/off
var showLog = true;
function logger (consoleString){
	if (showLog){console.log(consoleString) };
};

/*
var currentNumber = 0;
var finalObj;
*/

//Resize YouTube videos proportionately <---Moved outside for global scope
function resizeIframes(){
	var aspectRatio = $("iframe").width()/$("iframe").height();
	var columnWidth = $(".entry").width();
	$("iframe").width(columnWidth);
	$("iframe").height(columnWidth/aspectRatio);
}


$(document).ready( function() {
	//Dropdown navigation
	$( "#menu img" ).click(function() {
		//alert('clicked');
		$( "#menu #dropdown" ).slideToggle("drop");
		$('#menu #dropdown').scrollTo( 0 , 100 );
	});
	$( "#container" ).click(function() {$('#menu #dropdown').hide();});



	//Resize YouTube videos proportionately
	function resizeStuffOnResize(){
	  waitForFinalEvent(function(){
			resizeIframes();
	  }, 500, "some unique string");
	}

	//Wait for the window resize to 'end' before executing a function---------------
	var waitForFinalEvent = (function () {
		var timers = {};
		return function (callback, ms, uniqueId) {
			if (!uniqueId) {
				uniqueId = "Don't call this twice without a uniqueId";
			}
			if (timers[uniqueId]) {
				clearTimeout (timers[uniqueId]);
			}
			timers[uniqueId] = setTimeout(callback, ms);
		};
	})();

	window.addEventListener('resize', function(event){
		resizeStuffOnResize();
	});

	resizeStuffOnResize();
});