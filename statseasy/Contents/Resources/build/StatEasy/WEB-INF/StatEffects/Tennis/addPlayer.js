
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";

	var matchAttrPlayer = undefined;
	var relevantPlayerId = undefined;
	
	// Traverse the parent groups looking for the maximum parent to get data from
	var parentGrouping = relevantStat.event.eventGrouping;
	var maxParent = undefined;
	while (parentGrouping != null) {
		maxParent = parentGrouping;
		parentGrouping = parentGrouping.parentGroup;
	}
	if (maxParent != undefined) {
		matchAttrPlayer = maxParent.getAttributes().get(prefix + "Player");
		relevantPlayerId = Number(matchAttrPlayer);
	}
	
	if (matchAttrPlayer == undefined) {
		newState.set("errorMessage", "You must first set a player for this event in order to take this stat.");
		return;
	}
	
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (relevantPlayerId == playerInSeason.player.id) {
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
	name:         "Add Player",
	friendlyName: "Adds data to a statistic: Which player hit the ball",
	version:      1.5,
	execute:      execute,
	provides:     "%sep",
};