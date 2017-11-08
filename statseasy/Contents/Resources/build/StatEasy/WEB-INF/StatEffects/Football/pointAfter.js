
function execute() {
	relevantStat.setNumericalAtIndex(0, 3);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Point After Attempt",
	friendlyName: "This is used for the point after attempt of a touchdown.",
	version     : 1.4,
	execute     : execute,
	provides    : "was %sed?[Missed, Made, Blocked]:'Result'"
};