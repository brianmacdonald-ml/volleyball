
var allStatTypes = null;
var allPlayers = null;
var allOpponents = null;
var allStats = null;
var gameStates = null;
var gameVideo = null;
var game = null;

function retrieveData(jsonUrl, callback) {
	$.getJSON(jsonUrl, {
			all : "yes"
		}, function (data, textStatus) {
			setVariables(data, textStatus);
			callback();
		}
	)
}

function setVariables(data, textStatus) {
	allStatTypes = data["statTypes"];
	allPlayers = data["allPlayers"];
	allOpponents = data["allOpponents"];
	allStats = data["allStats"];
	gameStates = data["gameStates"];
	gameVideo = data["gameVideo"];
	game = data["game"];
}