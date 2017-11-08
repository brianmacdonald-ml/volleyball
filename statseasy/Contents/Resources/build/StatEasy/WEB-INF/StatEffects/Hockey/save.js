
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var shortHandedShotIndex = 2;
	var powerPlayShotIndex = 1;
	var evenStrengthShotIndex = 0;
	
	//get previous stat
	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
		//get previous stat type of shot
	var saveType = previousStat.getAllData().get(1).getNumericalData();
		//add type of save
	
	//regular shot
	if (saveType == evenStrengthShotIndex) {
		relevantStat.setNumericalAtIndex(evenStrengthShotIndex, 1);		
	}
	//PowerPlay shot
	if (saveType == powerPlayShotIndex) {
		relevantStat.setNumericalAtIndex(powerPlayShotIndex, 1);				
	}
	//ShotHanded shot
	if (saveType == shortHandedShotIndex) {
		relevantStat.setNumericalAtIndex(shortHandedShotIndex, 1);				
	}
	
	addGoalie(relevantStat.opponentStat, 0);
	
}

function addGoalie(opponentStat, index) {
	var prefix = opponentStat ? "their" : "our";
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	var qbId = currentState.get(prefix + "Goalie");
	
	if (qbId == undefined) {
		newState.set("errorMessage", "You must have a goalie set for " + relevantStat.event[prefix + "Season"].team.teamName + " in order to take this stat.");
		return true;
	}
	
	var ourPlayer = null;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (qbId == playerInSeason.player.id) {
			ourPlayer = playerInSeason.player;
		}
	}
	
	relevantStat.setPlayerAtIndex(ourPlayer, index);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Save",
	friendlyName: "Goalie made a save",
	version: 1.0,
	execute: execute,
	provides : "%sep %sed?[S, PPS, SHS]:'Type of Shot Saved'",
};