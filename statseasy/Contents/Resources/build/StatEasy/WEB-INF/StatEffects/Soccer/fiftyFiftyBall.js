
function execute() {
	addOppositeFiftyFifty();
}

function addOppositeFiftyFifty() {
	var wonOrLoss = relevantStat.getAllData().get(0).numericalData;
	var supplementalStatType = relevantStat.statType;
	
	var supplementalStat = new Packages.com.ressq.stateasy.model.Stat();
	supplementalStat.statType = supplementalStatType;
	supplementalStat.opponentStat = !relevantStat.opponentStat;
	supplementalStat.parentStat = relevantStat;
	supplementalStat.timeTaken = relevantStat.timeTaken;
	
	supplementalStat.setNumericalAtIndex(wonOrLoss == 0 ? 1 : 0, 0);
	
	newStats.add(supplementalStat);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "50/50 Ball",
	friendlyName: "A ball that was contested equally between the opposing teams.",
	version     : 1.2,
	execute     : execute,
};