

function movePlayer(from, to) {
	var atOldPos = currentState.get("position_" + from);
	
	if (!!atOldPos) {
		newState.set("position_" + to, atOldPos);
	}
}

function rotatePlayers(positionOffset) {
	movePlayer(2 + positionOffset, 1 + positionOffset);
	movePlayer(3 + positionOffset, 2 + positionOffset);
	movePlayer(4 + positionOffset, 3 + positionOffset);
	movePlayer(5 + positionOffset, 4 + positionOffset);
	movePlayer(6 + positionOffset, 5 + positionOffset);
	movePlayer(1 + positionOffset, 6 + positionOffset);
	
	var stateName = "ourRotation";
	if (positionOffset != 0) {
		stateName = "theirRotation";
	}
	var oldRotation = Number(currentState.get(stateName));
	if (!!oldRotation) {
		var newRotation = (oldRotation - 1) % 7;
		if (newRotation < 1) {
			newRotation = 6;
		}
		logger.debug("Old rotation = " + oldRotation + ", New rotation = " + newRotation);
		newState.set(stateName, newRotation);
	}
}

function execute() {
	var scoreString = !!relevantStat.opponentStat ? "theirScore" : "ourScore";
	var rotateString = !!relevantStat.opponentStat ? "weDo" : "theyDo";
	var newServer = !!relevantStat.opponentStat ? "theyDo" : "weDo";
	var positionOffset = !!relevantStat.opponentStat ? 6 : 0;
	
	var score = Number(currentState.get(scoreString));
	newState.set(scoreString, score+1);
	
	var hasServe = currentState.get("hasServe");
	if (hasServe != undefined) {
		if (hasServe == rotateString) {
			rotatePlayers(positionOffset);
		}
		
		newState.set("hasServe", newServer);
	}
	addSuccessOrFailure(true);
}

/*
 * We need to set up an object that will have name & version properties and 
 * have an execute() function
 */
var statType = {
	name:    "Our Point",
	friendlyName: "Gives us the point and rotates the players if we get the serve.  Rotation based on setter location.",
	version: 2.2,
	execute: execute
};