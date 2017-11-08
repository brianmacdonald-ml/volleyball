
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	newState.unset(prefix + "Goalie");
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Pull goalie",
	friendlyName: "Pull the current goalie for this game.",
	version: 1.0,
	execute: execute
};