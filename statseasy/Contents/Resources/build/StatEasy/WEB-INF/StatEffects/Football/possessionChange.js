
function execute() {
	var isLoss = relevantStat.statType.name == "Possession - Loss";
	var isOpponentStat = !!relevantStat.opponentStat;
	newState.set("hasBall", (isOpponentStat && !isLoss) || (!isOpponentStat && isLoss) ? "theyDo" : "weDo");
	var teamLosingPossession = currentState.get("hasBall");
	
	var playStartingStat = traverseBack(isStartStat);
	if ((playStartingStat != undefined) && (playStartingStat.statType.name == "Kickoff")) {
		teamLosingPossession = playStartingStat.beginningGameState.get("hasBall");
		logger.debug("Possession change found a kickoff stat, using that 'hasBall' state.");
	}
	
	if (teamLosingPossession != undefined) {
		addOppositePossession();
	}
}

function addOppositePossession() {
	var supplementalTypeName = relevantStat.statType.name == "Possession - Loss" ? "Possession - Gain" : "Possession - Loss";
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
		
		supplementalStat.setTimeAtIndex(relevantStat.getAllData().get(0).time, 0);
		
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
	name        : "Possession Change",
	friendlyName: "Sets which team has posession and what time the change of posession occurred at.",
	version     : 2.0,
	execute     : execute,
};