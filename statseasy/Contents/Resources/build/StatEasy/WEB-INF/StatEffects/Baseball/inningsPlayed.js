

function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	addPlayer(relevantStat.opponentStat, 1, 0);
//	relevantStat.addNumericalAtIndex(1,1);
}


/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Innings Played",
	friendlyName: "How many innings the player played.",
	version     : 1.2,
	execute     : execute,
	provides 	: "%sep:'Player' %sed:'Innings'"
};