
function execute() {
	// A marker for future stats
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Kickoff",
	friendlyName: "A kickoff from one team to another.",
	version     : 1.3,
	execute     : execute,
	provides:     "for %sed yards",
};