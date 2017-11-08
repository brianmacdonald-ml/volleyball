
var seasonDisplay;
var playerSelector;

$(document).ready( function() {
    $("#setGameDialogLink").click(showGamesDialog);

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
			title: "Select player(s) for the report:",
			id: "player"
		}
	);
	
	var selectedPlayerIds = [];
	for (var i in selectedPlayers) {
		selectedPlayerIds.push(selectedPlayers[i].id);
	}
	if (selectedPlayerIds.length > 0) {
		playerSelector.setSelected(selectedPlayerIds);
		setLinkText();
	}
	
    seasonDisplay = new SeasonDisplay("#showGamesDialog", eventGroupings, {
    	selectedGroupingIds: selectedGroupingIds,
    });

	$("#setPlayerDialogLink").click(function () {
		playerSelector.show(setLinkText)
	});
	
    $("#reportOptions").click(function (evt) {
    	$("#reportForm").show();
    	$(this).remove();
    	
    	if (evt != undefined) {
    		evt.stopPropagation();
    		evt.preventDefault();
    	}
    });
    
    $("#reportForm").submit(seasonDisplay.minimalSelectedSet);
});


function showGamesDialog(jsEvent) {
    jsEvent.preventDefault();
    jsEvent.stopPropagation();
    
    if (showGamesDialog.gameDialog == undefined) {
    	showGamesDialog.gameDialog = $("#showGamesDialog").dialog({ 
            closeText: '',
            modal: 'true',
            height: '500',
            width: '700',
            buttons: { 
                "Done": function() {
    				seasonDisplay.minimalSelectedSet();
    				
    				$(".hiddenEgIds").remove();
    				
    				$("#showGamesDialog input").each(function () {
    					var checked = $(this).attr("checked");
    					var id = $(this).attr("value");
    					if (checked) {
    						$("#setGameDialogLink").after("<input class='hiddenEgIds' type='hidden' name='egId' value='" + id + "'/>");
    					}
    				});
    				
    				$(this).dialog("close"); 
    			} 
            }
        });
    } else {
    	showGamesDialog.gameDialog.dialog("open");
    }
    
}

function setLinkText() {
	var allSelected = playerSelector.isAllSelected();

	if (allSelected) {
		$("#setPlayerDialogLink").text("All Players");
		$(".hiddenPlayerIds").remove();
		return;
	}
	
	$("#setPlayerDialogLink").text("Some Players");
	$(".hiddenPlayerIds").remove();
	
	var selectedPlayers = playerSelector.result();
	for (var i in selectedPlayers) {
		var id = selectedPlayers[i];
		$("#setPlayerDialogLink").after("<input class='hiddenPlayerIds' type='hidden' name='playerIds' value='" + id + "'/>");
	}
}