/*
 * Required for all LiveViews
 */
var classname = "PassAndServeLiveView";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function PassAndServeLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;
	
	var rotations = {};
	var passingStats = [];
	var hittingStats = [];
	var whoseRotation = "ourRotation";
	var whatLevel = "game";

	/* 
	 * Do some quick setup.  Should not be long running, we don't want to delay 
	 * other LiveViews.  This will be called on page startup.  This might not be
	 * necessary, since any non-long running tasks should really be done in the 
	 * constructor.  Or maybe we execute these after the window is done being 
	 * displayed
	 */
	function prepareToShow() {
	}
	this.prepareToShow = prepareToShow;
	
	function invalidate() {
		self.valid = false;
	}
	this.invalidate = invalidate;
	
	function initRotations() {
		rotations = {
			ourRotation: {
				1: {
					gameState: {},
					playerData: {},
				},
				2: {
					gameState: {},
					playerData: {},
				},
				3: {
					gameState: {},
					playerData: {},
				},
				4: {
					gameState: {},
					playerData: {},
				},
				5: {
					gameState: {},
					playerData: {},
				},
				6: {
					gameState: {},
					playerData: {},
				},
			},
			theirRotation: {
				1: {
					gameState: {},
					playerData: {},
				},
				2: {
					gameState: {},
					playerData: {},
				},
				3: {
					gameState: {},
					playerData: {},
				},
				4: {
					gameState: {},
					playerData: {},
				},
				5: {
					gameState: {},
					playerData: {},
				},
				6: {
					gameState: {},
					playerData: {},
				},
			},
		};
	}
	
	/*
	 * Helper method to append a score to a table
	 */
	function appendScore(ourScore, theirScore) {
		if (ourScore == undefined) {
			ourScore = 0;
		}
		if (theirScore == undefined) {
			theirScore = 0;
		}
		var innerHtml = "<table>" + 
			"<tr><td>" + dataManager.game.ourTeamName + ":</td><td>" + ourScore + "</td></tr>" +
			"<tr><td>" + dataManager.game.theirTeamName + ":</td><td>" + theirScore + "</td></tr>" +
			"</table>";
		
		return innerHtml;
	}

	function getPlayer(position, gameState) {
		var playerList = dataManager.allPlayers;
		if (position > 6) {
			playerList = dataManager.allOpponents;
		}
		if (gameState != undefined) {
			var player = playerList[gameState["position_" + position]];
			if (player != undefined) {
				return player.firstName + " " + player.lastName;
			}
		}
		return "?";
	}
	
	function getFirstData(type, stat) {
		if (getFirstData.cache == undefined) {
			getFirstData.cache = {
				"numerical": {},
				"player": {},
			};
		}
		
		var statType = stat.getStatType();
		
		if (getFirstData.cache[type][statType] == undefined) {
			var statTypeObj = dataManager.statTypes[statType];
			for (index in statTypeObj.parseTypes) {
				if (statTypeObj.parseTypes[index] == type) {
					getFirstData.cache[type][statType] = index; 
				}
			}
		}
		
		var index = getFirstData.cache[type][statType];
		if (index != undefined) {
			return stat.getStatData(index);
		}
	}
	
	function processStats(allStats) {
		initRotations();
		
		for (i in allStats) {
			var stat = allStats[i];
			
			var ourRotation = stat.getBeginningGameState()["ourRotation"];
			var theirRotation = stat.getBeginningGameState()["theirRotation"];
			
			// If we are processing data for multiple games, then the only game
			// we care about rotation information for is the current game.
			if ((ourRotation != undefined) && (stat.getGameId() == dataManager.game.id)) {
				rotations["ourRotation"][ourRotation].gameState = stat.getBeginningGameState();
			}
			if ((theirRotation != undefined) && (stat.getGameId() == dataManager.game.id)) {
				rotations["theirRotation"][theirRotation].gameState = stat.getBeginningGameState();
			}
			
			// Passing stats we care about for every game
			if (arrayContains(passingStats, stat.getStatType()) && ((ourRotation != undefined) || (theirRotation != undefined))) {
				var rating = getFirstData("numerical", stat);
				var player = getFirstData("player", stat);
				
				if (rating == undefined) {
					rating = 0;
				}
				
				if (ourRotation != undefined) {
					if (rotations["ourRotation"][ourRotation].playerData[player] == undefined) {
						rotations["ourRotation"][ourRotation].playerData[player] = {
							"count": 0,
							"sum": 0,
						};
					}
					
					rotations["ourRotation"][ourRotation].playerData[player].count++;
					rotations["ourRotation"][ourRotation].playerData[player].sum += rating;
				}
				if (theirRotation != undefined) {
					if (rotations["theirRotation"][theirRotation].playerData[player] == undefined) {
						rotations["theirRotation"][theirRotation].playerData[player] = {
							"count": 0,
							"sum": 0,
						};
					}
					
					rotations["theirRotation"][theirRotation].playerData[player].count++;
					rotations["theirRotation"][theirRotation].playerData[player].sum += rating;
				}
			}
		}
	}
	
	function setLocation(rotation, position, value) {
		$("#" + self.targetDivId + " #rot" + rotation + " .pos" + position).html(value);
	}
	
	function updateDisplay(whoseRotation, currentGameState) {
		$("#" + self.targetDivId + " .court").removeClass("currentRotation");
		var currentRotation = currentGameState != undefined ? currentGameState[whoseRotation] : undefined;
		for (rot in rotations[whoseRotation]) {
			if (rot == currentRotation) {
				$("#" + self.targetDivId + " #rot" + rot + " .court").addClass("currentRotation");
			}
			
			var gameState = rotations[whoseRotation][rot].gameState;
			for (pos = 1; pos <= 12; pos++) {
				var playerId = gameState["position_" + pos];
				var player = dataManager.allPlayers[playerId];
				if (pos > 6) {
					player = dataManager.allOpponents[playerId];
				}
				var playerData = rotations[whoseRotation][rot].playerData[playerId];
				
				var positionHtml = "<div class='name'>?</div>";
				if (player != undefined) {
					positionHtml = "<div class='name'>" + player.firstName + " " + player.lastName + "</div>";
				}
				if (playerData != undefined) {
					positionHtml += "<div class='data'>" + (playerData.sum/playerData.count).toFixed(2) + "(" + playerData.count + ")</div>";
				}
				setLocation(rot, pos, positionHtml);
			}
		}
	}
	
	function arrayContains(haystack, needle) {
		var contains = false;
		for (var i in haystack) {
			contains = contains || (haystack[i] == needle);
		}
		return contains;
	}
	
	function statTypeGoodFor(statType, selectionClass) {
		var numNumeric = 0;
		var numPlayers = 0;
		for (var i in statType.parseTypes) {
			if ("numerical" == statType.parseTypes[i]) {
				numNumeric++;
			} else if ("player" == statType.parseTypes[i]) {
				numPlayers++;
			}
		}
		if ("passing" == selectionClass) {
			return ((numNumeric == 0) || (numNumeric == 1)) && (numPlayers == 1);
		} else {
			return (numNumeric == 1) && (numPlayers == 1);
		}
	}
	
	function getStatTypeList(selectionClass, selectedValues) {
		var statTypeList = "";
		for (var i in dataManager.statTypes) {
			var statType = dataManager.statTypes[i];
			if (statTypeGoodFor(statType, selectionClass)) {
				var selected = "";
				if (arrayContains(selectedValues, Number(i))) {
					selected = "checked='checked' ";
				}
				statTypeList += "<input type='checkbox' class='" + selectionClass + "' " + selected + "value='" + i + "'/>" + statType.shortcut + " - " + statType.name + "<br/>";
			}
		}
		
		return statTypeList;
	}
	
	/**
	 * This should only be run once to add the HTML necessary to show the config menu
	 */
	function setUpConfigurationMenu() {
		var configurationHtml = "<table>" +
			"<tr><td>Passing Stats:</td><td>" + getStatTypeList("passing", passingStats) + "</td>" +
			"<td>Hitting Stats:</td><td>" + getStatTypeList("hitting", hittingStats) + "</td></tr></table>";
		var configDiv = $("#" + myTargetDivId + ' .configuration');
		var contentDiv = $("#" + myTargetDivId + ' .content');
		configDiv.html(configurationHtml);

		$("<input type='submit' value='Done Configuring' class='hoverGreen'/>").appendTo(configDiv).click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();
			
			passingStats = [];
			$("#" + myTargetDivId + ' .configuration .passing:checked').each(function () {
				passingStats.push(Number($(this).val()));
			});
			hittingStats = [];
			$("#" + myTargetDivId + ' .configuration .hitting:checked').each(function () {
				hittingStats.push(Number($(this).val()));
			});

			refreshDisplay();
			
			persistValues();
			
			configDiv.hide(500);
			contentDiv.show(500);
		});
	}
	
	function setUpContentArea() {
		var courtHtml = "<table class='court' style='padding:0px' cellspacing='0'>" +
			"<tr class='opponent-backrow'><td class='pos7'>?</td><td class='pos12'>?</td><td class='pos11'>?</td></tr>" + 
			"<tr class='opponent-frontrow'><td class='pos8'>?</td><td class='pos9'>?</td><td class='pos10'>?</td></tr>" + 
			"<tr class='our-frontrow'><td class='pos4'>?</td><td class='pos3'>?</td><td class='pos2'>?</td></tr>" + 
			"<tr class='our-backrow'><td class='pos5'>?</td><td class='pos6'>?</td><td class='pos1'>?</td></tr>" + 
			"</table>";
		var contentHtml = "<img class='configure' src='/StatEasy/images/edit.png' title='Configure This Live View'/>" +
			"<div class='contentParams'>" +
			"<input type='radio' name='whichRotation' value='ourRotation' class='rotationSelection' " + ((whoseRotation=="ourRotation")?"checked='checked'":"") + "/><p>Our Rotation</p>" + 
			"<input type='radio' name='whichRotation' value='theirRotation' class='rotationSelection'" + ((whoseRotation=="theirRotation")?"checked='checked'":"") + "/><p>Their Rotation</p><br/>" + 
			"<p>Use data from: <input type='radio' name='whichLevel' value='game' class='levelSelection' " + ((whatLevel=="game")?"checked='checked'":"") + "/><p>This Game</p>" +
			"<input type='radio' name='whichLevel' value='match' class='levelSelection'" + ((whatLevel=="match")?"checked='checked'":"") + "/><p>This Match</p>" +
			"<input type='radio' name='whichLevel' value='ourSeason' class='levelSelection'" + ((whatLevel=="ourSeason")?"checked='checked'":"") + "/><p>Their Season</p>" +
			"<input type='radio' name='whichLevel' value='theirSeason' class='levelSelection'" + ((whatLevel=="theirSeason")?"checked='checked'":"") + "/><p>Our Season</p>" +
			"</div>" +
			"<table><tr><td id='rot1'>Rotation 1:<br/>" + courtHtml + 
			"</td><td id='rot2'>Rotation 2:<br/>" + courtHtml + 
			"</td><td id='rot3'>Rotation 3:<br/>" + courtHtml + 
			"</td></tr>" +
			"<tr><td id='rot4'>Rotation 4:<br/>" + courtHtml + 
			"</td><td id='rot5'>Rotation 5:<br/>" + courtHtml + 
			"</td><td id='rot6'>Rotation 6:<br/>" + courtHtml +
			"</td></tr></table>";
		var contentDiv = $("#" + myTargetDivId + ' .content');
		var configDiv = $("#" + myTargetDivId + ' .configuration');
		
		contentDiv.html(contentHtml);
		
		$("#" + myTargetDivId + ' img.configure').click(function (jsEvent) {
			jsEvent.preventDefault();
			jsEvent.stopPropagation();

			contentDiv.hide(500);
			configDiv.show(500);
		});
		
		$("#" + myTargetDivId + ' .content input.rotationSelection').click(function (jsEvent) {
			whoseRotation = $("#" + myTargetDivId + ' .content input.rotationSelection:checked').val();
			refreshDisplay();
			persistValues();
		});
		
		$("#" + myTargetDivId + ' .content input.levelSelection').click(function (jsEvent) {
			whatLevel = $("#" + myTargetDivId + ' .content input.levelSelection:checked').val();
			refreshDisplay();
			persistValues();
		});
	}
	
	function persistValues() {
		var persistMe = {
			'passingStats': passingStats,
			'hittingStats': hittingStats,
			'whoseRotation': whoseRotation,
			'whatLevel': whatLevel,
		}
		var jsonPersist = JSON.stringify(persistMe);
		$.cookie(self.targetDivId, jsonPersist);
	}
	
	function reconstituteValues() {
		var persistedJSON = $.cookie(self.targetDivId);
		
		if (persistedJSON != undefined) {
			var persistedValues = JSON.parse(persistedJSON);
			passingStats = persistedValues.passingStats;
			hittingStats = persistedValues.hittingStats;
			whoseRotation = persistedValues.whoseRotation;
			whatLevel = persistedValues.whatLevel;
			
			return true;
		}
		
		return false;
	}
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (self.shown && self.valid) {
			return;
		}
		
		if (!self.shown) {
			var myDiv = $("#" + self.targetDivId);
		
			var innerHtml = "<div class='score'></div><div class='configuration'></div><div class='content'></div>";
			
			myDiv.html(innerHtml);
			
			var reconstituted = reconstituteValues();
			
			setUpConfigurationMenu();
			
			setUpContentArea();
			
			if (reconstituted) {
				var configDiv = $("#" + myTargetDivId + ' .configuration');
				var contentDiv = $("#" + myTargetDivId + ' .content');
				configDiv.hide();
				contentDiv.show();
			}
		}
		
		var scoreHtml = "";
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		if (gameState == undefined) {
			scoreHtml = appendScore(0, 0);
		} else {
			scoreHtml = appendScore(gameState.ourScore, gameState.theirScore);
		}
		var scoreDiv = $("#" + myTargetDivId + ' .score');
		scoreDiv.html("");
		scoreDiv.append(scoreHtml);
		
		refreshDisplay();
		
		self.shown = true;
		self.valid = true;
	}
	this.show = show;
	
	function refreshDisplay() {
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		
		if ("game" == whatLevel) {
			processStats(dataManager.allStats);
			
			updateDisplay(whoseRotation, gameState);
		} else {
			dataManager.getMoreData(whatLevel, function (moreData) {
				processStats(moreData.allStats);
				updateDisplay(whoseRotation, gameState);
			});
		}
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
}

