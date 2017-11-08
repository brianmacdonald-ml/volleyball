
function execute() {
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat
	var previousStat2 = allStats.get(relevantStat.getStatIndex() - 2); // Start at the index 2 before this stat
	var currentStat = allStats.get(relevantStat.getStatIndex()); // Start at the index just before this stat

	
	//make sure the most recent stat was a goal
	if (previousStat.statType.name == "Goal") {
		var goal_scorer = previousStat.getAllData().get(0).getPlayer();
		var assist_maker = currentStat.getAllData().get(0).getPlayer();
		relevantStat.setPlayerAtIndex(assist_maker, 0);
		relevantStat.setPlayerAtIndex(goal_scorer, 2);
	}
	else if (previousStat2.statType.name == "Goal") {
		var goal_scorer = previousStat2.getAllData().get(0).getPlayer();
		var assist_maker = currentStat.getAllData().get(0).getPlayer();
		relevantStat.setPlayerAtIndex(assist_maker, 0);
		relevantStat.setPlayerAtIndex(goal_scorer, 2);
	}
	else
		newState.set("errorMessage", "The previous stat (or one before it) must be a goal in order to take this stat.");
	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Assist",
	friendlyName: "An Assist",
	version: 1.3,
	execute: execute,
}