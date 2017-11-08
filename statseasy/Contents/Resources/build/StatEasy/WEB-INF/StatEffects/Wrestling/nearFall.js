function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	var points = relevantStat.allData.get(1).numericalData;
	
	addWrestler(relevantStat.opponentStat, 2);
	addWrestler(!relevantStat.opponentStat, 3);
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 4);
	}
	
	newState.set(scoreString, score + points);
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Near Fall",
	friendlyName: "A wrestler scores back points against another.",
	version: 2.7,
	execute: execute,
	provides: "by %sep on %seo at %set"
};