
function execute () {
	setClipEndTime(relevantStat);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Clip End",
	friendlyName: "Marks the end of a clip.",
	version     : 2.3,
	execute     : execute
};