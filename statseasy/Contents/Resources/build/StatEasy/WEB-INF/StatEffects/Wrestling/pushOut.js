function execute() {
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	
	addWrestler(relevantStat.opponentStat, 0);
	addWrestler(!relevantStat.opponentStat, 1);
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 2);
	}
	
	newState.set(scoreString, score + 1);
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Push Out",
	friendlyName: "A wrestler pushed his opponent out of bounds, scoring a point.",
	version: 1.7,
	execute: execute,
	provides: "by %sep on %seo at %set"
};