
function execute() {

	var timeoutNumber = 1;
	var forHalf = currentState.get("half");
	
	// Determine which timeout of the half this is.
	traverseBack(function () { return false; },
		function (someStat) {
			if ((getStatTypeName(someStat) == "Timeout") && 
				(someStat.opponentStat == relevantStat.opponentStat) &&
				((someStat.beginningGameState == undefined) ||
				 (forHalf == someStat.beginningGameState.get("half")))) 
			{
				timeoutNumber++;
			}
		}
	);
	
	relevantStat.setNumericalAtIndex(timeoutNumber - 1, 1);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name        : "Timeout",
	friendlyName: "A team has taken a timeout",
	version     : 1.6,
	execute     : execute,
	provides    : "is this teams %sed?[1:'First', 2:'Second', 3:'Third', 4:'Fourth', 5:'Fifth'] of the half"
};