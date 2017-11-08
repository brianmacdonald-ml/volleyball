/*
 * Required for all LiveViews
 */
var classname = "ViewLiveView";
var version = 4.2;

function inc(filename) {
	if (typeof document === 'undefined') {
		return;
	}
	
	var body = document.getElementsByTagName('body').item(0);
	script = document.createElement('script');
	script.src = filename;
	script.type = 'text/javascript';
	body.appendChild(script);
}

inc("/js/objectSelector.js");

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function ViewLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;

	var currentlySelectedViewId;
	var currentlySelectedGroupingId;
	var currentlySelectedGroupingFocusId;
	var currentlySelectedGroupingFocusName;
	var currentSortInfo;
	var playerFilter;
	
	var playerSelector;
	var selectedPlayers;
	var allPlayersSelected;

	/* 
	 * Do some quick setup.  Should not be long running, we don't want to delay 
	 * other LiveViews.  This will be called on page startup.  This might not be
	 * necessary, since any non-long running tasks should really be done in the 
	 * constructor.  Or maybe we execute these after the window is done being 
	 * displayed
	 */
	function prepareToShow() {
		var players = [];
		for (var i in dataManager.allPlayers) {
			var player = dataManager.allPlayers[i];
			players.push([player.id, player.firstName, player.lastName]);
		}
		players.sort(function (a, b) {
			return (a[2] || "").localeCompare(b[2]);
		});
		
		for (var i in dataManager.allOpponents) {
			var player = dataManager.allOpponents[i];
			players.push([player.id, player.firstName, player.lastName]);
		}
		
		playerSelector = new ObjectSelector(
			["", "First Name", "Last Name"],
			players,
			{
				title: "Select a player",
				id: "player"
			}
		);
	}
	this.prepareToShow = prepareToShow;
	
	function invalidate() {
		self.valid = false;
	}
	this.invalidate = invalidate;
	
	/*
	 * Helper method to append a score to a table
	 */
	function appendScoreAndGameClock(ourScore, theirScore) {
		if (ourScore == undefined) {
			ourScore = 0;
		}
		if (theirScore == undefined) {
			theirScore = 0;
		}
		var innerHtml = "<table>" + 
			"<tr><td>" + dataManager.game.ourTeamName + ":</td><td>" + ourScore + "</td><td rowspan='2'><div id='gameClock' class='timer'><div class='numbers'>&nbsp;</div></div></td></tr>" +
			"<tr><td>" + dataManager.game.theirTeamName + ":</td><td>" + theirScore + "</td></tr>" +
			"</table>";
		
		return innerHtml;
	}
	
	function playersHtml(somePlayers) {
		var html = "";
		
		for (var i in somePlayers) {
			var player = somePlayers[i];
			html += "<tr id='row" + player.id + "'>";
			html += "<td style='width:5%'><input type='checkbox' checked='checked' class='checkMeOut' name='selectedPlayers' value='" + player.id + "'/></td>";
			html += "<td><label>" + player.lastName + "</label></td>";
			html += "<td><label>" + player.firstName + "</label></td>";
			html += "</tr>";
		}
		
		return html;
	}
	
	function updateClock() {
		var lastStat = undefined;
		if (dataManager.allStats.length > 0) {
			lastStat = dataManager.allStats[dataManager.allStats.length - 1];
		}
		
		if ((lastStat == undefined) || (lastStat.getGameTime() == undefined)) {
			$("#gameClock").removeClass("stopped").removeClass("running").html("&nbsp;");
			return;
		}
		
		var isRunning = lastStat.getEndingGameState()["gameClockRunning"] == "1";
		var gameTime = undefined;
		if (isRunning) {
			$("#gameClock").removeClass("stopped").addClass("running");
			var lastGameTime = lastStat.getGameTime();
			var lastStatTime = lastStat.getTime();
			var thisStatTime = new Date().getTime() / 1000;
			var elapsedTime = thisStatTime - lastStatTime;
			
			if (lastStat.getEndingGameState()["gameClockDirection"] == "up") {
				gameTime = lastGameTime + elapsedTime;
			} else {
				gameTime = lastGameTime - elapsedTime;
				if (gameTime < 0) {
					gameTime = 0;
				}
			}
		} else {
			$("#gameClock").addClass("stopped").removeClass("running");
			gameTime = lastStat.getGameTime();
		}
		
		$("#gameClock .numbers").html(toTimeString(gameTime, 1));
		
		(function() {
			setTimeout(updateClock, 50);
		})();
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
		
			var innerHtml = "<div class='viewList'>View the stats for <select id='groupingId'>";
			var someGrouping = dataManager.groupings[dataManager.game.associatedEvent];
			currentlySelectedGroupingId = someGrouping.id;
			while (someGrouping != undefined) {
				innerHtml += "<option value='" + someGrouping.id + "'>" + someGrouping.name + "</option>";
				someGrouping = dataManager.groupings[someGrouping.parentGroup];
			}
			innerHtml += "</select>";
			innerHtml += " using <select id='viewId' name='gameIds'>";
			for (i in dataManager.allViews) {
				var currView = dataManager.allViews[i];
				if (!currView.hidden) {
					innerHtml += "<option value='" + currView.id + "-" + currView.type + "'" + (currView.defaultView ? "selected" : "") + ">" + currView.name + "</option>";
				}
			}
			innerHtml += "</select> focused on <select id='groupingFocusId' name='groupingFocusId'>";
			for (i in dataManager.reportGroupings) {
				innerHtml += "<option value='" + dataManager.reportGroupings[i].id + "'>" + dataManager.reportGroupings[i].name + "</option>";
			}
			innerHtml += "</select> using <a href='#' id='setPlayerDialogLink'>All Players</a>.<br/><input type='checkbox' id='playerFilter'>Only show players in the game.</div><div class='score'></div><div class='content'></div>";
			
			if (dataManager.allViews.length == 0) {
				innerHtml = "There are no views configured.  Add some views first.";
			} else {
				currentlySelectedViewId = dataManager.allViews[0].id + "-" + dataManager.allViews[0].type;
				for (i in dataManager.allViews) {
					var currView = dataManager.allViews[i];
					if (currView.defaultView) {
						currentlySelectedViewId = currView.id + "-" + currView.type;
					}
				}
			}
			
			myDiv.html(innerHtml);
			
			// Make sure the default grouping focus is pre-selected
			if (currentlySelectedGroupingFocusId == null) {
				for (var i in dataManager.reportGroupings) {
					if (dataManager.reportGroupings[i].defaultGrouping == true) {
						$("#" + self.targetDivId + " #groupingFocusId").val(dataManager.reportGroupings[i].id);
					}
				}
			}

			$("#" + self.targetDivId + " #viewId").change(function () {
				currentlySelectedViewId = $(this).val();
				self.valid = false;
				show();
			});	
			
			$("#" + self.targetDivId + " #groupingId").change(function () {
				currentlySelectedGroupingId = $(this).val();
				self.valid = false;
				show();
			});	
			
			$("#" + self.targetDivId + " #groupingFocusId").change(function () {
				currentlySelectedGroupingFocusId = $(this).val();
				currentlySelectedGroupingFocusName = $(this).find(":selected").text();
				self.valid = false;
				show();
			});
			currentlySelectedGroupingFocusName = $("#" + self.targetDivId + " #groupingFocusId :selected").text();
			
			$("#" + self.targetDivId + " #playerFilter").change(function () {
				playerFilter = $(this).is(':checked');
				self.valid = false;
				show();
			});
			
			$("#" + self.targetDivId + " #setPlayerDialogLink").click(function () {
				playerSelector.show(function () {
					allPlayersSelected = playerSelector.isAllSelected();
					selectedPlayers = playerSelector.result();
					
					if (allPlayersSelected) {
						$("#" + self.targetDivId + " #setPlayerDialogLink").html("All Players");
					} else {
						$("#" + self.targetDivId + " #setPlayerDialogLink").html("Some Players");
					}
					
					self.valid = false;
					show();
				});
			});
			updateClock();
		}
		
		var scoreHtml = "";
		var gameState = dataManager.gameStates[dataManager.game.currentGameState];
		if (gameState == undefined) {
			scoreHtml = appendScoreAndGameClock(0, 0);
		} else {
			scoreHtml = appendScoreAndGameClock(gameState.ourScore, gameState.theirScore);
		}
		var scoreDiv = $("#" + myTargetDivId + ' .score');
		scoreDiv.html("");
		scoreDiv.append(scoreHtml);
		
		if (dataManager.allViews.length > 0) {
			var urlVariables = {
				viewId: currentlySelectedViewId,
				egId: currentlySelectedGroupingId,
				grouping: currentlySelectedGroupingFocusId,
				format: 'ajax'
			};
			
			if (!allPlayersSelected) {
				urlVariables.playerIds = selectedPlayers;
			}
			
			$.get(
				dataManager.viewUrl, 
				urlVariables,
				function (data, textStatus) {
					//var responseHolder = $('<div></div>').html(data);
					$('#' + myTargetDivId + ' .content').html("");
					$('#' + myTargetDivId + ' .content').append(data);
					
					var sorterOptions = {
				        sortInitialOrder: 'desc'
				    };
					if (currentSortInfo != undefined) {
						sorterOptions["sortList"] = currentSortInfo;
					}
					
					if (playerFilter && ("Players" == currentlySelectedGroupingFocusName)) {
						var gameState = dataManager.gameStates[dataManager.game.currentGameState];
						
						var playerNumberToId = {
							our		: {},
							their	: {},
						};
						addPlayersToMap(dataManager.allPlayers, playerNumberToId.our);
						addPlayersToMap(dataManager.allOpponents, playerNumberToId.their);
						
						var allowablePlayerIds = {
							our		: {},
							their	: {},
						};
						for (var stateName in gameState) {
							var team = undefined;
							var playerNumber = undefined;
							if ("ourPlayer" == stateName.substring(0,9)) {
								team = "our";
								playerNumber = stateName.substring("ourPlayer".length, stateName.length);
							} else if ("theirPlayer" == stateName.substring(0,11)) {
								team = "their";
								playerNumber = stateName.substring("theirPlayer".length, stateName.length);
							}
							
							if (team != undefined) {
								var inOrOut = gameState[stateName];
								if (inOrOut == "In") {
									var playerId = playerNumberToId[team][playerNumber];
									allowablePlayerIds[team][playerId] = true;
								}
							}
						}
						
						hidePlayersNotInTheGame("our", allowablePlayerIds);
						hidePlayersNotInTheGame("their", allowablePlayerIds);
					}
					
					$(".tablesorter").filter(":visible").tablesorter(sorterOptions).bind("sortInfo", function (e, sortInfo) {
				    	currentSortInfo = sortInfo;
				    }).each(function() {
				    	$(this).stickyHeaders();
				    });
				}
			);
		}
		
		self.shown = true;
		self.valid = true;
	}
	this.show = show;
	
	function hidePlayersNotInTheGame(team, allowablePlayerIds) {
		var table = $("#team" + dataManager.game[team + "TeamId"]);
		table.find("tr").each(function (index, elem) {
			var playerId = $(elem).attr('id');
			if ((playerId != undefined) && (playerId.length > 0)) {
				if (!allowablePlayerIds[team][playerId]) {
					$(elem).remove();
				}
			}
		});
	}
	
	function addPlayersToMap(playerList, numberToIdMap) {
		for (var i in playerList) {
			var player = playerList[i];
			numberToIdMap[player.number] = player.id;
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

