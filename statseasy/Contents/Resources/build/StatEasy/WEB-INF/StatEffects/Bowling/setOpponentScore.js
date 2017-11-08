
function execute() {
	var scoreString = !!relevantStat.opponentStat ? "ourScore" : "theirScore";
	var score = relevantStat.allData.get(0).numericalData;
	
	newState.set(scoreString, score);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Set Opponent Score",
	friendlyName: "Just sets the opponent score, nothing else.",
	version     : 1.0,
	execute     : execute,
};