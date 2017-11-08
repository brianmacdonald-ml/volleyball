function execute() {
	var scoreString = !relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	
	addWrestler(relevantStat.opponentStat, 0);
	
	newState.set(scoreString, score + 1);
	
	if (relevantStat.gameTime != undefined) {
		relevantStat.setTimeAtIndex(relevantStat.gameTime, 1);
	}
	
	newState.set("gameClockRunning", 0);
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Penalty",
	friendlyName: "A penalty on a wrestler, stopping the clock and awarding a point to the other wrestler.",
	version: 1.5,
	execute: execute,
	provides: "on %sep at %set"
};