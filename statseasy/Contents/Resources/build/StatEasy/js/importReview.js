
var playerSelector = undefined;
var seasonSelector = undefined;

var playerResolution = {};
var seasonResolution = {};

$(document).ready(function () {
	$("tr.team a").click(showSelectSeasonDialog);
	$("tr.player a").click(showSelectPlayerDialog);
	$("#resolutionForm").submit(formSubmission);
	$("#completeImport").click(showImportProgress);
	
	var players = [];
	for (var i in allPlayers) {
		var player = allPlayers[i];
		players.push([player.id, player.firstName, player.lastName]);
	}
	
	playerSelector = new ObjectSelector(
		["&nbsp;", "First Name", "Last Name"],
		players,
		{
			style: "radio",
			buttonText: "Use this player",
			title: "Choose a player you already have.",
			id: "player"
		}
	);
	
	var seasons = [];
	for (var i in allSeasons) {
		var season = allSeasons[i];
		seasons.push([season.id, allTeams[season.teamId].name, season.name]);
	}
	
	seasonSelector = new ObjectSelector(
		["&nbsp;", "Team Name", "Season Name"],
		seasons,
		{
			style: "radio",
			buttonText: "Use this team & season",
			title: "Choose a team & season you already have",
			id: "season"
		}
	);
	
});

function showImportProgress() {
	if (showImportProgress.dialog == undefined) {
		showImportProgress.dialog = $("#importProgress").dialog({ 
			closeText: '',
			modal: 'true',
		    height: '185',
		    width: '292',
			buttons: {
				"Ok": function() {
					$("#resolutionForm input").attr("disabled", "disabled");
					$("#resolutionForm input").removeClass();
					showImportProgress.dialog.dialog("close"); 
				}
			}
		});
	} else {
		showImportProgress.dialog.dialog("open");
	}
}

function formSubmission() {
	var inputHtml = "";
	
	for (var i in playerResolution) {
		var result = playerResolution[i];
		inputHtml += "<input type='hidden' name='player" + i + "' value='" + result + "'/>";
	}
	
	for (var i in seasonResolution) {
		var result = seasonResolution[i];
		inputHtml += "<input type='hidden' name='season" + i + "' value='" + result + "'/>";
	}
	
	$("#resolutionForm").append(inputHtml);
}

function restoreSeason(seasonId) {
	return function (jsEvent) {

		jsEvent.preventDefault();
		jsEvent.stopPropagation();
		
		var season = allSeasons[seasonResolution[seasonId]];
		delete seasonResolution[seasonId];
		
		var originalSeason = allOriginalSeasons[seasonId];
		var originalTeam = allOriginalTeams[originalSeason.teamId];
		
		$("#season" + seasonId + " .name").html(originalTeam.name + " & " + originalSeason.name);
		$("#season" + seasonId + " .status").html("You <span class='need'>do not have</span> this team & season");
		$("#season" + seasonId + " .action").html("StatEasy will create it or <a href='#'>you can choose one you already have</a>");
		$("#season" + seasonId + " .action a").click(showSelectSeasonDialog);
		
		var specifiedSeasonPlayerMap = {};
		for (var i in season.allPlayers) {
			var pis = season.allPlayers[i];
			specifiedSeasonPlayerMap[pis.number] = pis;
		}
		
		for (var i in originalSeason.allPlayers) {
			var pis = originalSeason.allPlayers[i];
			var specifiedPlayer = specifiedSeasonPlayerMap[pis.number];
			if (specifiedPlayer != undefined) {
				restorePlayer(pis.pisId);
			}
		}
	}
}

function showSelectSeasonDialog(jsEvent) {
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	var rowId = $(jsEvent.currentTarget).parents("tr").attr("id");
	
	seasonSelector.show(function () {
		var resultingSeasonId = seasonSelector.result();
		
		var season = allSeasons[resultingSeasonId];
		var team = allTeams[season.teamId];
		
		$("#season" + resultingSeasonId + " .name").html(team.name + " & " + season.name);
		$("#season" + resultingSeasonId + " .status").html("You <span class='specified'>have chosen</span> this team & season");
		$("#season" + resultingSeasonId + " .action").html("StatEasy will use it or <a href='#'>you can change it back</a>");
		$("#season" + resultingSeasonId + " .action a").click(restoreSeason(resultingSeasonId));
		
		seasonResolution[resultingSeasonId] = season.id;
		
		var specifiedSeasonPlayerMap = {};
		for (var i in season.allPlayers) {
			var pis = season.allPlayers[i];
			specifiedSeasonPlayerMap[pis.number] = pis;
		}
		
		var originalSeason = allOriginalSeasons[resultingSeasonId];
		for (var i in originalSeason.allPlayers) {
			var pis = originalSeason.allPlayers[i];
			var specifiedPlayer = specifiedSeasonPlayerMap[pis.number];
			if (specifiedPlayer != undefined) {
				resolvePlayer(pis.pisId, specifiedPlayer);
			}
		}
	});
}

function restorePlayer(playerId) {
	var player = allOriginalPlayers[playerId];
	
	$("#player" + playerId + " .name").html(player.firstName + " " + player.lastName);
	$("#player" + playerId + " .status").html("You <span class='need'>do not have</span> this player");
	$("#player" + playerId + " .action").html("StatEasy will create it or <a href='#'>you can choose one you already have</a>");
	$("#player" + playerId + " .action a").click(showSelectPlayerDialog);
	
	delete playerResolution[playerId];
}

function resolvePlayer(playerId, player) {
	$("#player" + playerId + " .name").html(player.firstName + " " + player.lastName);
	$("#player" + playerId + " .status").html("You <span class='specified'>have chosen</span> this player");
	$("#player" + playerId + " .action").html("StatEasy will use it or <a href='#'>you can change it back</a>");
	$("#player" + playerId + " .action a").click(function (jsEvent) {
		jsEvent.preventDefault();
		jsEvent.stopPropagation();
			
		restorePlayer(playerId);
	});
	
	playerResolution[playerId] = player.id;
}

function showSelectPlayerDialog(jsEvent) {
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	var rowId = $(jsEvent.currentTarget).parents("tr").attr("id");
	var playerId = Number(rowId.substr("player".length));
	
	playerSelector.show(function () {
		var resultingPlayerId = playerSelector.result();
		
		var player = allPlayers[resultingPlayerId];
		
		resolvePlayer(playerId, player);
	});
}

function clearSearchNow() {
	$(".search input").val("");
	filterPlayers();
}

function filterPlayers() {
	var value = $(this).val();
	
	if (value == "") {
		$("#selectPlayerDialog tr").attr("style", "");
		return;
	}
	
	value = value.toLowerCase();
	for (var i in allPlayers) {
		// Here we're using the document.getElementById instead of jQuery 
		// because I found it affected performance of the video playback when searching.
		var eventObj = document.getElementById("row" + allPlayers[i].id);
		var name = allPlayers[i].firstName + " " + allPlayers[i].lastName;
		name = name.toLowerCase();
		
		var className;
		if (name.indexOf(value) != -1) {
			// Matches
			className = "";
		} else {
			// Non-matches
			className = "display:none";
		}
		eventObj.setAttribute("style", className);
	}
}