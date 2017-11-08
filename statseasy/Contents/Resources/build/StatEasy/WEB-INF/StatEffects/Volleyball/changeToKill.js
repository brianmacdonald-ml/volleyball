function execute(){
	var scoringChance = traverseBack(isScoringOpportunity);
	
	if (scoringChance != undefined) {
		relevantStat.opponentStat = scoringChance.opponentStat
		modifiedStats.add(relevantStat);
		
		var killStatType = findStatTypeByName("Kill");
		
		if (killStatType != undefined) {
			scoringChance.statType = killStatType;	
		} else {
			logger.debug("StatType 'Kill' was not found.");
		}
		
		addSideoutSuccessForTeam(relevantStat.opponentStat);
		
		
		// If we just modify the score of the scoringChance stat directly, all 
		// of the other stats that link to this gameState will have their score 
		// modified; which isn't what we want.  To overcome this, we'll create a new gameState to modify.
		var newGameState = scoringChance.getEndingGameState().clone();
		scoringChance.setEndingGameState(newGameState);
		
		
		//Need to change set attempt to assist
		var allStats = relevantStat.event.allStats;
		var i = scoringChance.getStatIndex()+1;
		if(i<allStats.size()){
			var previousStat = allStats.get(i);
			var supplementalTypeName = "Assist";
			var supplementalStatType = undefined;
			
			for (var i = 0; i < allStatTypes.size(); i++) {
				var statType = allStatTypes.get(i);
				if (statType.name == supplementalTypeName) {
					supplementalStatType = statType;
				}
			}
			logger.debug("StatType '" + supplementalTypeName);
			if(previousStat.statType.name == "Set Attempt"){
				previousStat.statType = supplementalStatType;
				modifiedStats.add(previousStat);
			}
		}
		
		modifiedStats.add(scoringChance);
		
		logger.debug("Done");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Change Kill",
	friendlyName: "Changes attempt to kill",
	version     : 2.0,
	execute     : execute,
};