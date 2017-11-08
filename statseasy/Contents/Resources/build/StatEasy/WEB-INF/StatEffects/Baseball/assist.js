
function execute() {
	adjustTeamToOther();
	var allStats = relevantStat.event.allStats;
	if (allStats.size() <= 1) {
		return;
	}

	if (relevantStat.getStatIndex() <= 0) {
		return;
	}
	
	var previousStat = allStats.get(relevantStat.getStatIndex() - 1); // Start at the index just before this stat


	relevantStat.setNumericalAtIndex(0, 0);

	if(relevantStat.statType.name == "Pitcher")
		position = 1;
	else if(relevantStat.statType.name == "Catcher")
		position = 2;
	else if(relevantStat.statType.name == "1st Baseman")
		position = 3;
	else if(relevantStat.statType.name == "2nd Baseman")
		position = 4;
	else if(relevantStat.statType.name == "3rd Baseman")
		position = 5;
	else if(relevantStat.statType.name == "Shortstop")
		position = 6;
	else if(relevantStat.statType.name == "Left Fielder")
		position = 7;
	else if(relevantStat.statType.name == "Center Fielder")
		position = 8;
	else if(relevantStat.statType.name == "Right Fielder")
		position = 9;
	
	addPlayer(relevantStat.opponentStat, position, 1);
	
	setTimeStamps();

}
/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Field or Assist",
	friendlyName: "A player fielded or assisted a ball",
	version:      2.2,
	execute:      execute,
	provides: "%sed?[Fielded, Assist, Putout, p:'Putout and Assist']:'Fielded, Assisted, or Putout' by %sep:'Player'"
};