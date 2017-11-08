function execute() {
	beginPossession("Defensive", relevantStat.opponentStat, relevantStat);
	beginPossession("Offensive", !relevantStat.opponentStat, relevantStat);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Begin Defensive Possession",
	friendlyName: "This stat initiates an offensive possession for this team.",
	version     : 1.1,
	execute     : execute
};