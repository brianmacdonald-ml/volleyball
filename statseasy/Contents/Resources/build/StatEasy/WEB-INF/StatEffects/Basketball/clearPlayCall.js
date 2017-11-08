
function execute() {
	newState.unset("playCall");
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Clear Play Call",
	friendlyName: "Clears the play call of the offense.",
	version     : 1.0,
	execute     : execute,
};