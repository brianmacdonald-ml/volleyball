var seasonDisplay = undefined;
var playerSelector = undefined;
var segmentsToEvent = {};
var eventsProgress = {};

$(document).ready(function () {
	$("#setPlayerDialogLink").click(showSetPlayerDialog);
	
	seasonDisplay = new SeasonDisplay("#seasonEvents", eventGroupings);
	
	$("#reportForm").submit(seasonDisplay.minimalSelectedSet);
	
	var players = [];
	for (var i in allPlayers) {
		var player = allPlayers[i];
		players.push([player.id, player.firstName, player.lastName]);
	}
	players.sort(function (a, b) {
		return (a[2] || "").localeCompare(b[2]);
	});
	
	playerSelector = new ObjectSelector(
		["", "First Name", "Last Name"],
		players,
		{
			title: "Select a player",
			id: "player",
			initiallyChecked : false,
		}
	);
	
	listenForInfo("/ws?clazz=torrent", function(data, options) {
		console.log(data);
		for (var i in data) {
			var downloadInfo = data[i].dl;
			downloadInfo.duration = eventsProgress[segmentsToEvent[i]][i].duration; 
			eventsProgress[segmentsToEvent[i]][i] = downloadInfo;
			updateUI();
		}
	},{
		onopen : function(evt) {
			var ws = evt.target;
			for (var i in eventGroupings) {
				var evt = eventGroupings[i];
				eventsProgress[evt.id] = {};
				for (var j in evt.gameVideos) {
					for (var k in evt.gameVideos[j]) {
						var segment = evt.gameVideos[j][k];
						eventsProgress[evt.id][segment.uuid] = {
							progress : 0,
							timeRemaining : 0,
							duration : segment.duration
						};
						segmentsToEvent[segment.uuid] = evt.id;
						ws.send("{ interestingId : '" + segment.uuid + "', clazz : 'torrent' }");
					}
				}
			}
		}
	}, null, "ws");
});

function getEventPercent(singleEventProgress) {
	var totalDownloaded = 0;
	var totalDuration = 0;
	
	for (var i in singleEventProgress) {
		var segment = singleEventProgress[i];
		totalDownloaded += (segment.progress * segment.duration);
		totalDuration += segment.duration;
	}
	
	return Math.round(totalDownloaded / totalDuration);
}

function updateUI() {
	// Update UI based on eventsProgress JSON object
	for (var i in eventsProgress) {
		var percent = getEventPercent(eventsProgress[i]);
		if (percent < 100) {
			var link = $("<a href='#' class='percentUploaded betterToolTip' alt='videoInfoHere'>( " + percent + "% )</a>");
			$('#eventId' + i + ' .percentUploadedSpan').html(link);
		} else {
			$('#eventId' + i + ' .percentUploadedSpan').html("");
		}
	}
}

function showSetPlayerDialog(jsEvent) {
	jsEvent.preventDefault();
	jsEvent.stopPropagation();
	
	playerSelector.show(function () {
		var allPlayersSelected = playerSelector.isAllSelected();
		var selectedPlayers = playerSelector.result();
		
		if (allPlayersSelected) {
			$(".hiddenPlayerIds").remove();
			$("#setPlayerDialogLink").html("All Players");
		} else {
			for (var i = 0; i < selectedPlayers.length; i++) {
				$("#setPlayerDialogLink").after("<input class='hiddenPlayerIds' type='hidden' name='playerIds' value='" + selectedPlayers[i] + "'/>");
			}
			$("#setPlayerDialogLink").html("Some Players");
		}
	});
	
}