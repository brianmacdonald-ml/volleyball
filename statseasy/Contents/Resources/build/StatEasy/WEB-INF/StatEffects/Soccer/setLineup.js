
function execute() {
	var teamString = !!relevantStat.opponentStat ? "their" : "our";
	
	for (var i = 0; i < 10; i++) {
		var player = relevantStat.allData.get(i).player;
		
		newState.set(teamString + "Player" + player.id, "In");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Set Lineup",
	friendlyName: "Puts 10 players into spots on the court",
	version: 1.0,
	execute: execute
};