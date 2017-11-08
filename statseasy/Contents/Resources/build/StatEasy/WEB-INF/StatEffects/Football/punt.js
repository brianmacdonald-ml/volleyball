
function execute() {
	// This is a marker for future stats
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Punt",
	friendlyName: "Kick the ball to the other team.",
	version     : 1.3,
	execute     : execute,
	provides    : "for %sed yards",
};