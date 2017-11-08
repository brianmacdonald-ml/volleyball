
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	adjustEndTime();
	
	adjustTeam();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Whistle",
	friendlyName: "Signals the end of a play.",
	version     : 2.3,
	execute     : execute,
};