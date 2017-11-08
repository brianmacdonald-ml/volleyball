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
	
	newState.set(prefix + "Position", "neutral");
	newState.set(otherPrefix + "Position", "neutral");

	newState.set(scoreString, score + 1);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Escape",
	friendlyName: "A wrestler escapes from a defensive position, scoring a point.",
	version: 1.8,
	execute: execute,
	provides: "by %sep on %seo at %set"
};