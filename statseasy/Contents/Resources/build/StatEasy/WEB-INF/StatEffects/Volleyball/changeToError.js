function execute(){
	var scoringChance = getPrevious(isScoringOpportunity);
	
	if (scoringChance != undefined) {
		relevantStat.opponentStat = scoringChance.opponentStat
		modifiedStats.add(relevantStat);
		
		var supplementalStatType = findStatTypeByName("Error");
		if (supplementalStatType != undefined) {
			scoringChance.statType = supplementalStatType;
			
			pointFor(scoringChance, !scoringChance.opponentStat, currentState, newState);
			
			setFirstAttempt();
			
			addSetAttempt(relevantStat.opponentStat);
			
			modifiedStats.add(scoringChance);
		} else {
			logger.debug("StatType 'Error' was not found.");
		}
	}
	
	scoringChance = getPrevious(isServiceAttempt);
	
	if (scoringChance != undefined) {
		relevantStat.opponentStat = scoringChance.opponentStat
		modifiedStats.add(relevantStat);
		
		var supplementalStatType = findStatTypeByName("Service Error");
		if (supplementalStatType != undefined) {
			scoringChance.statType = supplementalStatType;
			
			pointFor(scoringChance, !scoringChance.opponentStat, scoringChance.getBeginningGameState(), scoringChance.getEndingGameState());
			
			modifiedStats.add(scoringChance);
		} else {
			logger.debug("StatType 'Service Error' was not found.");
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Change To Error",
	friendlyName: "Changes a (Service) Attempt to a (Service) Error",
	version     : 1.7,
	execute     : execute,
};