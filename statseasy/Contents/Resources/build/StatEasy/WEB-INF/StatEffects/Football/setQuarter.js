
function execute() {
	var quarter = relevantStat.allData.get(0).numericalData;
	quarter++;
	
	if ((quarter == 2) || (quarter == 4)) {
		addPossessionTypeAtTime("Possession - Loss", 0);
		addPossessionTypeAtTime("Possession - Gain", relevantStat.getAllData().get(1).time);
	} else if ((quarter == 3) || (quarter == 5)) {
		addPossessionTypeAtTime("Possession - Loss", 0);
		newState.unset("hasBall");
	}
	
	if (quarter == 5) {
		quarter = "OT";
	} else {
		newState.set("half", quarter <= 2 ? 1 : 2);
	}
	
	newState.set("quarter", quarter);
}



function addPossessionTypeAtTime(supplementalTypeName, atTime) {
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
		supplementalStat.opponentStat = currentState.get("hasBall") == "theyDo";
		supplementalStat.parentStat = relevantStat;
		supplementalStat.timeTaken = relevantStat.timeTaken;
		
		supplementalStat.setTimeAtIndex(atTime, 0);
		
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
	name:    "Set Quarter",
	friendlyName: "Sets what the current quarter is.",
	version: 1.6,
	execute: execute
};