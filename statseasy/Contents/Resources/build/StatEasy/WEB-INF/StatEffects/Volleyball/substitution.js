
function execute() {
	var positionOffset = !!relevantStat.opponentStat ? 6 : 0;
	var playerComingIn = relevantStat.allData.get(0).player;
	var playerGoingOut = relevantStat.allData.get(1).player;
	
	for (var position = 1; position <= 6; position++) {
		var positionNumber = positionOffset + position;
		
		if (Number(currentState.get("position_" + positionNumber)) == playerGoingOut.id) {
			newState.set("position_" + positionNumber, playerComingIn.id);
			logger.debug("Subbed player " + playerGoingOut.id + " for " + playerComingIn.id + " in position " + positionNumber);
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Substitution",
	friendlyName: "Substitute one player for another",
	version: 2.3,
	execute: execute
};