
function execute() {
	addPossessionLoss(currentState.get("hasBall") == "theyDo");
}

function addPossessionLoss(opponentStat) {
	var supplementalTypeName = "Possession - Loss";
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
		supplementalStat.opponentStat = opponentStat;
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		supplementalStat.setTimeAtIndex(0, 0);
		
		newStats.add(supplementalStat);
	} else {
		logger.debug("StatType '" + supplementalTypeName + "' was not found.");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "End of Game",
	friendlyName: "The game has ended!",
	version     : 1.2,
	execute     : execute,
};