
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	var player = relevantStat.allData.get(0).player;
	newState.set(prefix + "Goalie", player.id);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Goalie",
	friendlyName: "Sets the goalkeeper for this game.",
	version: 1.0,
	execute: execute
};