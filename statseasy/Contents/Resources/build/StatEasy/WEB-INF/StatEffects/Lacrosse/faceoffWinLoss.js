
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
	
	if (previousStat.statType.name == "Faceoff") {
		var statTypeNames = {};
		statTypeNames[true] = "Faceoff - Win";
		statTypeNames[false] = "Faceoff - Loss";
		
		var supplementalStatType = findStatTypeByName(statTypeNames[relevantStat.statType.name == statTypeNames[false]]);
		
		var players = [];
		players[0] = previousStat.allData.get(0).player;
		players[1] = previousStat.allData.get(1).player;
		
		relevantStat.setPlayerAtIndex(players[relevantStat.opponentStat == previousStat.opponentStat ? 0 : 1], 0);
		relevantStat.parentStat = previousStat;
		relevantStat.timeTaken = previousStat.timeTaken;
		
		var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
		supplementalStat.statType = supplementalStatType;
		supplementalStat.opponentStat = !relevantStat.opponentStat;
		supplementalStat.parentStat = previousStat;
		supplementalStat.timeTaken = previousStat.timeTaken;
		supplementalStat.setPlayerAtIndex(players[supplementalStat.opponentStat == previousStat.opponentStat ? 0 : 1], 0);
		
		newStats.add(supplementalStat);
	}
}

function findStatTypeByName(typeName) {
	var supplementalStatType = undefined;
	
	for (var i = 0; i < allStatTypes.size(); i++) {
		var statType = allStatTypes.get(i);
		if (statType.name == typeName) {
			supplementalStatType = statType;
		}
	}
	
	return supplementalStatType;
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Faceoff Win/Loss",
	friendlyName: "Sets which team won the previous faceoff.",
	version     : 1.3,
	execute     : execute,
	provides    : "%sep",
};