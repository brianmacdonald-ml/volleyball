
function execute() {
	var scoreString = !!relevantStat.opponentStat ? "theirPlaycall" : "ourPlaycall";
	newState.set(scoreString, relevantStat.statType.name);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Play Call",
	friendlyName: "Sets the play call of the offense.",
	version     : 1.5,
	execute     : execute,
};