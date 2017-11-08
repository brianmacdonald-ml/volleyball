
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
	var previousStat2 = allStats.get(relevantStat.getStatIndex() - 2); // Start at the index 2 before this stat
	var currentStat = allStats.get(relevantStat.getStatIndex()); // Start at the index just before this stat
	
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score + 1);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Own Goal",
	friendlyName: "When a defender unintentially puts the ball into their own goal, resulting in a goal for the other team",
	version: 1.2,
	execute: execute,
}