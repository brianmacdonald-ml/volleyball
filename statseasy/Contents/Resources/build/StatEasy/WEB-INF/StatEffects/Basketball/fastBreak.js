
function execute() {
	if (relevantStat.allData.size() == 0) {
		fastBreakMarkPreviousAttempt();
	} else {
		fastBreakIsMadeAttempt();
	}
}

function fastBreakIsMadeAttempt() {
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	
	newState.set(scoreString, score + 2);
	
	markBenchPoint(relevantStat);
	
	modifiedStats.add(relevantStat);
}

function fastBreakMarkPreviousAttempt() {
	var scoringChance = traverseBack(isScoringOpportunity);
	
	if (scoringChance != undefined) {
		markFastBreak(scoringChance);
		
		relevantStat.opponentStat = scoringChance.opponentStat;
		
		modifiedStats.add(scoringChance);
	}
}

function markFastBreak(scoringChance) {
	var newStartingState = scoringChance.getBeginningGameState().clone();
	newStartingState.set("fastBreak", "1");
	scoringChance.setBeginningGameState(newStartingState);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Fast Break",
	friendlyName: "The previous scoring attempt happened on a fast break.",
	version     : 1.5,
	execute     : execute,
};