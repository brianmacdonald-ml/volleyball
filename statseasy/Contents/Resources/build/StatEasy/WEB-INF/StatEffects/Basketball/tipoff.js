function execute() {
	if (relevantStat.allData.get(1).numericalData == 0) {
		// Tip Off won
		beginPossession("Offensive", relevantStat.opponentStat, relevantStat);
		beginPossession("Defensive", !relevantStat.opponentStat, relevantStat);
		if (!relevantStat.opponentStat) {
			newState.set("possessionArrow", "theirTeam");
		} else {
			newState.set("possessionArrow", "ourTeam");
		}
	} else {
		// Tip Off lost
		beginPossession("Defensive", relevantStat.opponentStat, relevantStat);
		beginPossession("Offensive", !relevantStat.opponentStat, relevantStat);
		if (!relevantStat.opponentStat) {
			newState.set("possessionArrow", "ourTeam");
		} else {
			newState.set("possessionArrow", "theirTeam");
		}
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Tip Off",
	friendlyName: "This stat handles possession start based on the result of a tip off.",
	version     : 1.5,
	execute     : execute
};