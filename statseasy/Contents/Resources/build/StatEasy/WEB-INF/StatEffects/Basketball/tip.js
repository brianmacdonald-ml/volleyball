
function execute() {
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	
	newState.set(scoreString, score + 2);
	
	markBenchPoint(relevantStat);
	
	modifiedStats.add(relevantStat);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Tip",
	friendlyName: "The player got an offensive rebound and then immediately made a shot in the paint.",
	version     : 1.0,
	execute     : execute,
};