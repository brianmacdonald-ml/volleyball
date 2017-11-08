
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var carryStat = traverseBack(isNotMetaAndNotWhistleStat);
	
	if (carryStat == undefined) {
		newState.set("warningMessage", "Unable to find a starting stat for this Penalty (No 'snap' or carry stat).");
		return;
	}
	
	var startingYardLine = Number(carryStat.getBeginningGameState().get("yardLine"));
	var distance = Number(carryStat.getBeginningGameState().get("distance"));
	var endingYardLine = getYardLineFrom(relevantStat, 2, 3);
	
	var acceptDecline = relevantStat.allData.get(1).numericalData;
	var downAdjust = relevantStat.allData.get(4).numericalData;
	var discountStats = relevantStat.allData.get(5).numericalData;
	
	if (acceptDecline == 0) {
		var distanceData = distanceBetween(startingYardLine, endingYardLine, !relevantStat.opponentStat);
		
		if (carryStat.getBeginningGameState().get("yardLine") != undefined) {
			relevantStat.setNumericalAtIndex(distanceData, 6);
		} else {
			newState.set("warningMessage", "There is no yard line set.  There will be no distance calculation for this Penalty.");
		}
		
		// No matter how we adjust the down, we'll end up at the ending yard line
		newState.set("yardLine", endingYardLine);
		
		// The penalty is against the team that doesn't have the ball, subtract the penalty yardage
		if ((relevantStat.opponentStat ? "theyDo" : "weDo") != carryStat.getBeginningGameState().get("hasBall")) {
			distanceData = distanceData * -1;
		}
		
		if (downAdjust == 0) {
			// Adjust distance. Only adjust down if the resulting distance is 0 or less.
			if (distance + distanceData <= 0) {
				newState.set("down", "1");
				newState.set("distance", "10");
			} else if (carryStat.getBeginningGameState().get("down") != undefined) {
				newState.set("down", carryStat.getBeginningGameState().get("down"));
				newState.set("distance", distance + distanceData);
			}
		} else if (downAdjust == 1) {
			// Automatic first & 10
			newState.set("down", "1");
			newState.set("distance", "10");
		} else {
			// Loss of down & adjust distance
			calculateNewDownAndDistanceWithState(distanceData, carryStat.getBeginningGameState());
		}
		
		// Adjust the score back to what it was before the carry stat (and any scores) happened
		newState.set("ourScore", carryStat.getBeginningGameState().get("ourScore"));
		newState.set("theirScore", carryStat.getBeginningGameState().get("theirScore"));
		
		traverseBack(isStartStat, function (currentStat) {
			currentStat.endingGameState.set("result", "penalty");
			
			modifiedStats.add(currentStat);
		});
	} else if (acceptDecline == 1) {
		// No distance for this penalty if declined
		relevantStat.setNumericalAtIndex(0, 6);
	} else if (acceptDecline == 2) {
		// No distance for this penalty if offsetting
		relevantStat.setNumericalAtIndex(0, 6);
		
		// In fact, since this is an offsetting penalty, treat this play series as if it didn't happen at all.
		// Copy everything in from the carryStat
		var statTypeName = getStatTypeName(carryStat);
		logger.debug("Offsetting penalty.  Carry stat: " + statTypeName);
		if (statTypeName != "Penalty") {
			newState.set("down", carryStat.getBeginningGameState().get("down"));
			newState.set("distance", carryStat.getBeginningGameState().get("distance"));
			newState.set("yardLine", carryStat.getBeginningGameState().get("yardLine"));
			newState.set("ourScore", carryStat.getBeginningGameState().get("ourScore"));
			newState.set("theirScore", carryStat.getBeginningGameState().get("theirScore"));
			
			traverseBack(isStartStat, function (currentStat) {
				currentStat.endingGameState.set("result", "penalty");
				
				modifiedStats.add(currentStat);
			});
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
	name        : "Penalty",
	friendlyName: "A penalty occurred.",
	version     : 2.3,
	execute     : execute,
	provides	: "for a loss of %sed yards",
};