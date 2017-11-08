
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var player = relevantStat.getAllData().get(0).getPlayer();
	relevantStat.setPlayerAtIndex(player, 0);
	
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var otherPrefix = !relevantStat.opponentStat ? "their" : "our";
	shotCount = 0;
	if(currentState.get(prefix +"ShotCount") != null)
		shotCount = currentState.get(prefix +"ShotCount");
	newState.set(prefix + "ShotCount", String(Number(shotCount)+1));
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Shot On Goal",
	friendlyName: "A shot on goal!",
	version: 2.2,
	execute: execute,
};