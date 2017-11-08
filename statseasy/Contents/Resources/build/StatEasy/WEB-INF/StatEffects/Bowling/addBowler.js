
function addPlayer(prefix) {
	var matchAttrPlayer = undefined;
	var relevantPlayerId = undefined;
	
	matchAttrPlayer = currentState.get(prefix + "Player");
	relevantPlayerId = Number(matchAttrPlayer);
	
	if (matchAttrPlayer == undefined) {
		newState.set("errorMessage", "You must have a bowler set for this event in order to take stats.");
		return true;
	}
	
	var allPlayers = relevantStat.event[prefix + "Season"].allPlayers;
	for (var i = 0; i < allPlayers.size(); i++) {
		var playerInSeason = allPlayers.get(i);
		if (relevantPlayerId == playerInSeason.player.id) {
			var whoHitItData = new Packages.com.ressq.stateasy.model.StatData();
			whoHitItData.player = playerInSeason.player;
			var insertionIndex = getFirstIndexOfType(relevantStat, "player");
			if (insertionIndex < relevantStat.allData.size()) {
				relevantStat.allData.set(insertionIndex, whoHitItData);
			} else {
				relevantStat.allData.add(whoHitItData);
			}
		}
	}
}

function getFirstIndexOfType(stat, statType) {
	var parseTypes = stat.statType.parseTypes;
	
	for (var i = 0; i < parseTypes.size(); i++) {
		if (parseTypes.get(i).type.getName() == statType) {
			return i;
		}
	}
	
	return undefined;
}

function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	addPlayer(prefix);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Add Bowler",
	friendlyName: "Adds data to a statistic: Which player bowled",
	version:      1.4,
	execute:      execute,
	provides:     "%sep",
};