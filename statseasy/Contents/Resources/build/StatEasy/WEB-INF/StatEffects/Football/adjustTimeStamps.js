
function execute() {
	clearPlayStatesIfTerminal();
	setTimeStamps();
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Adjust Time Stamps",
	friendlyName: "Ajusts the time stamps of the statistic so that it starts at the beginning of the play.",
	version     : 1.0,
	execute     : execute,
};