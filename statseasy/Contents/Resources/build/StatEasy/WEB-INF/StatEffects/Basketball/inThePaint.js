
function execute() {
	if (relevantStat.allData.size() == 0) {
		inThePaintMarkPreviousAttempt();
	} else {
		inThePaintIsMadeAttempt();
	}
}

function inThePaintIsMadeAttempt() {
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var score = Number(currentState.get(scoreString));
	
	newState.set(scoreString, score + 2);
	
	markBenchPoint(relevantStat);
	
	modifiedStats.add(relevantStat);
}

function inThePaintMarkPreviousAttempt() {
	var scoringChance = traverseBack(isScoringOpportunity);
	
	if (scoringChance != undefined) {
		markInThePaint(scoringChance);
		
		relevantStat.opponentStat = scoringChance.opponentStat;
		
		modifiedStats.add(scoringChance);
	}
}

function markInThePaint(scoringChance) {
	var newStartingState = scoringChance.getBeginningGameState().clone();
	newStartingState.set("inThePaint", "1");
	scoringChance.setBeginningGameState(newStartingState);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "In The Paint",
	friendlyName: "The previous scoring attempt was in the paint.",
	version     : 1.6,
	execute     : execute,
};