
function execute() {
	var ourPossession = null;
	if (relevantStat.getBeginningGameState().get("possessionArrow") == "ourTeam") {
		ourPossession = true;
	} else if (relevantStat.getBeginningGameState().get("possessionArrow") == "theirTeam") {
		ourPossession = false;
	} else {
		newState.set("warningMessage", "Possession arrow is not currently set. Did you begin with a tip off?");
	}
	if (ourPossession != null) {
		beginPossession("Offensive", !ourPossession, relevantStat);
		beginPossession("Defensive", ourPossession, relevantStat);
		switchPossessionArrow();
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Jump Ball",
	friendlyName: "A jump ball occurred that changed possession.",
	version     : 1.6,
	execute     : execute
};