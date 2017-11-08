
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var setter = getSetter(relevantStat.opponentStat);
	
	var player = relevantStat.allData.get(0).player;
	
	if ((setter != undefined) && (player.id == setter.id)) {
		addSupplementalStatByTypeAddSetter(relevantStat, "Setter Out");
	}
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Dig",
	friendlyName: "Adds a 'Setter Out' statistic if the setter dug the ball.",
	version     : 2.5,
	execute     : execute,
};