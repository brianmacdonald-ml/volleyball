var startPossessionStatTypes = {};
var endPossessionStatType = null;

function execute() {
	beginPossession("Offensive", relevantStat.opponentStat, relevantStat);
	beginPossession("Defensive", !relevantStat.opponentStat, relevantStat);
}

function beginPossession(possessionType, opponent, initStat) {
	var lastPossessionStat = traverseBack(function(someStat) {
		// Return last Clip Start or Clip End stat by this team
		return (someStat.statType.statEffectObject != null) && 
			   (someStat.statType.statEffectObject.name == "Clip Start" || someStat.statType.statEffectObject.name == "Clip End") &&
			   (someStat.opponentStat == opponent);
	});
	
	if (endPossessionStatType == null || startPossessionStatTypes[possessionType] == null) {
		for (var i = 0; i < allStatTypes.size(); i++) {
			var statType = allStatTypes.get(i);
			if (statType.name == "End Possession") {
				endPossessionStatType = statType;
			}
			
			if (statType.name == possessionType + " Possession") {
				startPossessionStatTypes[possessionType] = statType;
			}
		}
	}
	
	// Do not add a new possession if an open possession of the same type already exists
	if (lastPossessionStat == null || lastPossessionStat.statType.name.indexOf(possessionType) == -1) {
		
		// End the current playcall
		var oppString = !!opponent ? "their" : "our";
		newState.unset(oppString + "Playcall");
		
		// Now start an offensive possession
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = startPossessionStatTypes[possessionType];
		supplementalStat.opponentStat = opponent;
		supplementalStat.parentStat = initStat;
		supplementalStat.timeTaken = initStat.timeTaken;
		supplementalStat.seekTimeOffset = 0.0;
		
		// Set previous possession end time
		setClipEndTime(supplementalStat);
		
		newStats.add(supplementalStat);
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Begin Offensive Possession",
	friendlyName: "This stat initiates an offensive possession for this team.",
	version: 2.8,
	execute: execute,
	sharedCode: true
};