
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var startingYardLine = Number(currentState.get("yardLine"));
	var endingYardLine = getYardLineFrom(relevantStat, 1, 2);
	
	var distanceData = distanceBetween(startingYardLine, endingYardLine, !relevantStat.opponentStat);
	
	relevantStat.setNumericalAtIndex(-1 * distanceData, 3);
	
	var qbSacked = addQuarterback(!relevantStat.opponentStat, 4);
	
	newState.set("yardLine", endingYardLine);

	calculateNewDownAndDistance(distanceData);
	
	if (qbSacked != undefined) {
		var supplementalTypeName = "Run";
		var supplementalStatType = undefined;
		
		for (var i = 0; i < allStatTypes.size(); i++) {
			var statType = allStatTypes.get(i);
			if (statType.name == supplementalTypeName) {
				supplementalStatType = statType;
			}
		}
		
		if (supplementalStatType != undefined) {
			var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
			supplementalStat.statType = supplementalStatType;
			supplementalStat.opponentStat = !relevantStat.opponentStat;
			supplementalStat.parentStat = relevantStat;
			supplementalStat.timeTaken = relevantStat.timeTaken;
			supplementalStat.beginningGameState = relevantStat.beginningGameState;
			
			logger.debug("Qb " + qbSacked.firstName);
			
			supplementalStat.setPlayerAtIndex(qbSacked, 0);
			supplementalStat.setNumericalAtIndex(distanceData, 1);
			
			newStats.add(supplementalStat);
		} else {
			logger.debug("StatType '" + supplementalTypeName + "' was not found.");
		}
		
	}
	
	clearPlayStatesIfTerminal();
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Sack",
	friendlyName: "A player tackles the quarterback behind the line of scrimmage.",
	version     : 2.2,
	execute     : execute,
	provides    : "for a loss of %sed yards, sacking %seo",
};