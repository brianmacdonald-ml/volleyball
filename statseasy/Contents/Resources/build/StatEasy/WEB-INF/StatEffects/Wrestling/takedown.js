function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	
	addWrestler(relevantStat.opponentStat, 0);
	addWrestler(!relevantStat.opponentStat, 1);
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 2);
	}
	
	newState.set(prefix + "Position", "offensive");
	newState.set(otherPrefix + "Position", "defensive");
	
	newState.set(scoreString, score + 2);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Takedown",
	friendlyName: "A wrestler puts an opponent in a defensive position from a neutral position, scoring two points.",
	version: 4.4,
	execute: execute,
	provides: "by %sep on %seo at %set"
};