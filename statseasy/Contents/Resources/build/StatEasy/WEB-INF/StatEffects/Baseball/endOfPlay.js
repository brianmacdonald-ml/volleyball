
function execute() {
	
	
	adjustEndTime();
	
	
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "End Of Play",
	friendlyName: "Signals the end of a play.",
	version     : 1.3,
	execute     : execute,
};