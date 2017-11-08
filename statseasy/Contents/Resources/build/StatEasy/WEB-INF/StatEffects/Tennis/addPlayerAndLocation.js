
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	var hitFrom = currentState.get("lastHitTo");
	var hitTo = relevantStat.allData.get(0).numericalData;
	newState.set("lastHitTo", hitTo);
	
	if (hitFrom != undefined) {
		var hitFromData = new Packages.com.ressq.stateasy.model.StatData();
		hitFromData.numericalData = Number(hitFrom);
		relevantStat.allData.add(hitFromData);
	}

	var relevantPlayerId = Number(currentState.get(prefix + "Player"));
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (relevantPlayerId = playerInSeason.player.id) {
			var whoHitItData = new Packages.com.ressq.stateasy.model.StatData();
			whoHitItData.player = playerInSeason.player;
			relevantStat.allData.add(whoHitItData);
		}
	}
	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Player And Location",
	friendlyName: "Adds data to a statistic: Which player hit the ball and where did they hit it from",
	version:      1.3,
	execute:      execute,
	provides:     "%sed %sep",
};