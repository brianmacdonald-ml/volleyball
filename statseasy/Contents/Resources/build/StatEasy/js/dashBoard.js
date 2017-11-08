
var SEASON_URL = "?season="
var seasons = new Array();

/**
 * Season object
 */
function season(id, wins, losses, ties) {
	this.id = id;
	this.wins = wins;
	this.losses = losses;
	this.ties = ties;
}

/**
 * Hides all season select boxes, then shows the selected one.
 * @return
 */
function showSeasonsForTeam() {
	$("select.seasonSelection").hide();
	$(getActiveSeasonSelectId()).show();
}

/**
 * Retrieve the season objects by it's ID
 */
function getSeasonRecordById(id) {
	var season = null;
	for(var i=0; i < seasons.length; i++) {
		if (seasons[i].id == id) {
			season = seasons[i];
			break;
		}
	}
	if ((season != null) && (season.wins != null)) {
		return "Record: " + season.wins + "-" + season.losses + "-" + season.ties;
	} else {
		return "";
	}
}

/**
 * Gets the id of the DOM element for the active select box.
 */
function getActiveSeasonSelectId() {
	return "#seasonForTeam" + $("#defaultTeam").val();
}

/**
 * Makes the appropriate selections from the cookie objects.
 */
function selectTeamAndSeasonFromCookies() {
	// Get the team and season selection from the cookie:
	var teamId = $.cookie("selectedTeam");
	var seasonId = $.cookie("selectedSeason");
	
	if (teamId != null) {
		$("#defaultTeam").val(teamId);
	}
	
	showSeasonsForTeam();
	
	if (seasonId != null) {
		$(getActiveSeasonSelectId()).val(seasonId);
	}

}

/**
 * Creates binding for each div element
 * @param bub - the bubble element
 * @return
 */
function configureBinding(bub) {
    $("#" + bub).bind("click", function() {
        var appendMe = "";
        if ($(getActiveSeasonSelectId()).val() != undefined &&
        		bubbles[bub].appendSeason) {
        	appendMe = "?season=" + $(getActiveSeasonSelectId()).val();
        }
        window.location = bubbles[bub].url + appendMe;
    });
}

/**
 * Called when team is changed.
 */
function teamChangeEventHandler() {
	showSeasonsForTeam();
	$.cookie("selectedTeam", $("#defaultTeam").val(), { expires: 365 });	
}

/**
 * Called when season is changed.
 */
function seasonChangeEventHandler() {
	$.cookie("selectedTeam", $("#defaultTeam").val(), { expires: 365 });
	$.cookie("selectedSeason", $(getActiveSeasonSelectId()).val(), { expires: 365 });	
}

function getUnresolvedSharedVideos(dataUrl) {
	var options = {};
	
	options["action"] = "videos";
	options["type"] = "js";
	
	$.getJSON(dataUrl,
		options,
		function (data, textStatus) {
			if (textStatus != "success") {
				$("#sharedVideos").html("There was an error while checking.");
			} else {
				if (data.error != null) {
					$("#sharedVideos").html("There was an error while checking.");
				} else if (data.newVids > 0) {
					$("#sharedVideos").html("You have new shared videos.");
				} else {
					$("#sharedVideos").html("No new shared videos.");
				}
			}
		}
	);
}

$(document).ready(function(){
	
	//setup divs for clicking
    for (bub in bubbles) {
        configureBinding(bub);
    }

	$("#defaultTeam").bind("change", teamChangeEventHandler);
	$("select.seasonSelection").bind("change", seasonChangeEventHandler);
	
	// Update team and season from cookies
	selectTeamAndSeasonFromCookies();
	
});