
function execute() {
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Ratable",
	friendlyName: "This play can be rated on a 0 - 5 scale.",
	version     : 1.1,
	execute     : execute,
	provides    : "was %sed?[0:'Bad', 1, 2, 3, 4, 5:'Great']:'Rating'"
};