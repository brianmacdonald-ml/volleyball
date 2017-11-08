
function execute() {
	adjustTeamToOther();
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	var position = relevantStat.allData.get(1).numericalData;
	
	addPlayer(relevantStat.opponentStat, position+1, 2);
	addBatter(!relevantStat.opponentStat,3);
	
	var errorString = !!relevantStat.opponentStat ? "theirErrors" : "ourErrors";
	var errors = Number(currentState.get(errorString));
	newState.set(errorString, errors+1);
	
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Error",
	friendlyName: "A player made an error",
	version: 1.8,
	execute: execute,
	provides: "%sep:'Player' hit by batter %seo:'Batter'"
};