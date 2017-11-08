
function execute() {
	if (relevantStat.allData.size() == 0) {
		dunkMarkPreviousAttempt();
	} else {
		dunkIsMadeAttempt();
	}
}

function dunkMarkPreviousAttempt() {
	var scoringChance = traverseBack(isScoringOpportunity);
	
	if (scoringChance != undefined) {
		markDunk(scoringChance);
		
		relevantStat.opponentStat = scoringChance.opponentStat;
		
		modifiedStats.add(scoringChance);
	}
}

function markDunk(scoringChance) {
	var newStartingState = scoringChance.getBeginningGameState().clone();
	newStartingState.set("dunk", "1");
	scoringChance.setBeginningGameState(newStartingState);
}

function dunkIsMadeAttempt() {
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
	name        : "Dunk",
	friendlyName: "The previous scoring attempt happened on a dunk.",
	version     : 1.3,
	execute     : execute,
};