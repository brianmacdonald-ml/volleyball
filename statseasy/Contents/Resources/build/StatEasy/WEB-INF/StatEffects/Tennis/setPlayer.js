
function execute() {
	var prefix = !!relevantStat.opponentStat ? "their" : "our";
	var player = relevantStat.allData.get(0).player;
	
	var parentGrouping = relevantStat.event.eventGrouping;
	var maxParent = undefined;
	while (parentGrouping != null) {
		maxParent = parentGrouping;
		parentGrouping = parentGrouping.parentGroup;
	}
	if (maxParent != undefined) {
		maxParent.addAttribute(prefix + "Player", player.id);
		maxParent.addAttribute(prefix + "Player.name", player.firstName + player.lastName);
		maxParent.addAttribute(prefix + "Player.name.first", player.firstName);
		maxParent.addAttribute(prefix + "Player.name.last", player.lastName);
	}
	
	newState.set(prefix + "Player", player.id);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:         "Set Player",
	friendlyName: "Sets the current player for this game",
	version:      1.3,
	execute:      execute,
};