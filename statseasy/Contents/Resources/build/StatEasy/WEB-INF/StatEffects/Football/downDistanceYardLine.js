
function execute() {
	var down = relevantStat.allData.get(0).numericalData;
	var distance = relevantStat.allData.get(1).numericalData;
	var yardline = getYardLineFrom(relevantStat, 2, 3);
	
	newState.set("down", down);
	newState.set("distance", distance);
	newState.set("yardLine", yardline);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Down, Distance & Yard Line",
	friendlyName: "Sets the down number, distance to go and the yard line.",
	version     : 1.3,
	execute     : execute,
};