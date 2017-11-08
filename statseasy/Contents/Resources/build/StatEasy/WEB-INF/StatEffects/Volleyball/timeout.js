
function execute() {
	newState.set("timeoutCounter", "0");
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Timeout",
	friendlyName: "Reset the '# of Plays After A Timeout' Counter",
	version: 1.2,
	execute: execute
};