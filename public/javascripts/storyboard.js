
//Grabbing the query string for the sheet
/*
function getParameterByName(name){
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)";
	var regex = new RegExp(regexS);
	var results = regex.exec(window.location.search);

	if(results == null){
		return "";
	} else { 
		return decodeURIComponent(results[1].replace(/\+/g, " "));
	}
}



//This refers to the GoogleDoc sheet with the storyboard/script.
//default = '1AH4JuiQF-SdS97mqio8cns9G3wMp1o0YA-5H_4yk_q4'
//var public_spreadsheet_url = '1AH4JuiQF-SdS97mqio8cns9G3wMp1o0YA-5H_4yk_q4'

var public_spreadsheet_url = '1QOqxqfaEPLDlvpNDnn_cqrLzJQMyQLDlg7gdvfPf1Vo';
var spreadsheetPagesQuery = getParameterByName('sheet');

if(spreadsheetPagesQuery!=''&&spreadsheetPagesQuery!=null){
	public_spreadsheet_url = spreadsheetPagesQuery;
}

*/


$(document).ready( function() {
Tabletop.init( { key: public_spreadsheet_url,
						callback: showInfo,
						wanted: [ "config", "storyboard" ],
						debug: true } )
})

function showInfo(data, tabletop) {
	//If the user specifies the version of the storyboard, include it
	var version = "";
	if (data.config.elements[0].version != ""){
		version = " (" + data.config.elements[0].version + ")";
	}

	$("#container h1").text(data.config.elements[0].title);
	$("#container h3.description").text(data.config.elements[0].description + version);

	var panels = "";
	var image, script, description, imagePrefix, speaker;
	var length = data.storyboard.elements.length;

	var imagePrefix = data.config.elements[0].imageprefix;
	var imageSize = "square";

	if (data.config.elements[0].size){
		imageSize = data.config.elements[0].size;
	}

	var includeNumbers = data.config.elements[0].numberPanels;
	var panelNumber = '';
	var pageShadow = '';


	//Loop through the returned data and concatenate the HTML for the panels
	for (var i = 0; i < length; i++){
		image = data.storyboard.elements[i].image;
		script = data.storyboard.elements[i].voiceover;
		description = data.storyboard.elements[i].description;
		var timecode = data.storyboard.elements[i].timecode;
		var speakerTemp = data.storyboard.elements[i].speaker;

		//Include the speaker's name
		if(speakerTemp != "" && speakerTemp != null && data.storyboard.elements[i].speaker){
			speaker = "[" + speakerTemp + "]  ";
		}

		//Include a timecode
		if(timecode != "" && timecode != null){
			timecode = "<p class='timecode'>" + speaker + timecode + "</p>"
		}

		//Include numbers for the current spread/panel
		if (includeNumbers == "TRUE"){
			panelNumber = '<p class="number">'+ (i + 1) + '</p>';
		}

		if (data.storyboard.elements[i].hidePageShadow == "TRUE"){
			pageShadow = ' style = "visibility: hidden;"';
		} else {
			pageShadow = '';
		}

		panels += '	<div class="panel"><div class="image" style="background-image: url(' + imagePrefix + image + ');"><img src="/images/storyboard_' + imageSize + '.png" ' + pageShadow + '>' + panelNumber + '</div>' + timecode + '<p class="script">' + script + '</p><p class="description">'+ description + '</p></div>';
		speaker = "";
	}

	//Add the panels to the page
	$("#grid").html(panels)
}
var spreadsheetUrl = 'https://docs.google.com/spreadsheets/d/' + public_spreadsheet_url + '/pubhtml'
$("#footer").html("This book dummy was created from this <a target='_new' href='" + spreadsheetUrl + "'>Google spreadsheet</a> using this <a href='https://github.com/bbgvisualjournalist/storyboard'>simple tool</a> I made.")
