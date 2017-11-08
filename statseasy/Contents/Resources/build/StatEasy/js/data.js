
function DataManager(crudUrl, dataUrl, playlistUrl, syncFromPlaylist, dataReadyCallback) {
	var thisDM = this;
	thisDM.syncFromPlaylist = syncFromPlaylist;
	thisDM.dataUrl = dataUrl;
	thisDM.crudUrl = crudUrl;
	thisDM.playlistUrl = playlistUrl;

	// Notification constants
	DataManager.ADD    		= "add";
	DataManager.DELETE 		= "delete";
	DataManager.EDIT   		= "edit";
	DataManager.READY  		= "ready";
	DataManager.ERROR  		= "error";
	DataManager.WARNING		= "warning";
	DataManager.ADD_TYPE 	= "addType";
	
	/**************************************************************************/
	/**                          Notifications                               **/
	/**************************************************************************/
	var notifications = {
		"add"     : [],
		"delete"  : [],
		"edit"    : [],
		"ready"   : [dataReadyCallback],
		"error"   : [],
		"addType" : [],
		"warning" : []
	};
	
	function registerForNotification(whatNotification, callback) {
		notifications[whatNotification].push(callback);
	}
	this.registerForNotification = registerForNotification;
	
	function notify(whatNotification, additionalData) {
		var whoToNotify = notifications[whatNotification];
		for (var i in whoToNotify) {
			whoToNotify[i](additionalData);
		}
	}
	
	/**************************************************************************/
	/**                          Get Stats                                   **/
	/**************************************************************************/
	function getAllDataForGrouping(eventGroupingId, callback) {
		getAllData({
			eventGroupingId : eventGroupingId,
		}, callback);
	}
	this.getAllDataForGrouping = getAllDataForGrouping;
	
	function getAllDataForEvent(eventId) {
		getAllData({
			eventId : eventId,
		});
	}
	this.getAllDataForEvent = getAllDataForEvent;
	
	function getAllDataForVideo(gameVideoId) {
		getAllData({
			gameVideoId : gameVideoId,
		});
	}
	this.getAllDataForVideo = getAllDataForVideo;
	
	function getAllData(options, callback) {
		options["action"] = "data";
		options["type"] = "js";
		options["all"] = "yes";
		
		$.getJSON(dataUrl,
			options,
			function (data, textStatus) {
			
				if (textStatus != "success") {
					alert("JSON error: " + testStatus);
				}
				
				if (callback != undefined) {
					callback(data);
				} else {
					DataManager.receiveData(data);
					
					notify("ready", thisDM);
				}
			}
		);
	}
	
	/**
	 * Currently, the only supported "levels" are 'grouping', 'ourSeason', 'theirSeason'
	 */
	function getMoreData(eventGroupingId, level, dataCallback) {
		$.getJSON(dataUrl,
			{
				eventGroupingId : eventGroupingId,
				action          : "data",
				type            : "js",
				all             : "yes",
				scope           : level,
			},
			function (data, textStatus) {
				if (textStatus != "success") {
					alert("JSON error: " + testStatus);
				}
				
				DataManager.receiveData(data);
				
				dataCallback(data);
			}
		);
	}
	this.getMoreData = getMoreData;
	
	function setVideoSyncPoints(videoId, syncPoints, dataCallback) {
		var syncData = {
			syncData : syncPoints,
		}
		
		$.post(
			dataUrl, 
			{ 
				video  : videoId,
				events : JSON.stringify(syncData),
				type   : "js",
				action : "sync",
			}, 
			dataCallback
		);
	}
	this.setVideoSyncPoints = setVideoSyncPoints;
	
	function getPlaylistInfo(playlistId, dataCallback, includeAllStats) {
		var options = {
			playlist : playlistId,
			action   : "playlist",
			type     : "js",
		};
		
		if (includeAllStats) {
			options["includeAllStats"] = true;
		}
		
		$.getJSON(playlistUrl,
			options,
			function (data, textStatus) {
				if (textStatus != "success") {
					alert("JSON error: " + testStatus);
				}
				
				DataManager.receiveData(data);
				
				if (dataCallback != undefined) {
					dataCallback(data.playlist);
				} else {
					notify("ready", thisDM);
				}
			}
		);
	}
	this.getPlaylistInfo = getPlaylistInfo;
	
	function getPlaylistListing(dataCallback) {
		$.getJSON(playlistUrl,
			{
				action : "playlistListing",
				type   : "js",
			},
			function (data, textStatus) {
				if (textStatus != "success") {
					alert("JSON error: " + testStatus);
				}
				
				DataManager.receiveData(data);
				
				dataCallback(data);
			}
		);
	}
	this.getPlaylistListing = getPlaylistListing;
	
	function savePlaylist(playlist, dataCallback) {
		$.post(
			playlistUrl,
			{
				type     : "js",
				action   : "playlist",
				playlist : JSON.stringify(playlist),
			},
			function (data, textStatus) {
				if (textStatus != "success") {
					alert("JSON error: " + testStatus);
				}
				
				DataManager.receiveData(data);
				
				dataCallback(data);
			},
			"json"
		);
	}
	this.savePlaylist = savePlaylist;
	
	/**************************************************************************/
	/**                          CRUD Functions                              **/
	/**************************************************************************/
	function addStatType(statType, additionalData) {
		$.post(
			crudUrl,
			{
				action			: 'Add Stat Type',
				type			: "js",
				name	 		: statType.name,
				shortcut		: statType.shortcut,
				statEffectName 	: statType.type
			},
			postResultHandler(DataManager.ADD_TYPE, additionalData),
			"json"
		);
	}
	this.addStatType = addStatType;
	
	function addStat(eventId, statString, additionalData, options) {
		var syncPoint = options.syncPoint;
		
		var postOptions = {
			action       : 'Add Plays',
			id           : eventId,
			type         : "js",
			statsToParse : statString,
		};
		
		var statTime = options.statTime;
		if (options.statTime != undefined) {
			postOptions.time = options.statTime;
		}
		
		$.post(	
			crudUrl, 
			postOptions,
			function (data, textStatus) {
				if (syncPoint != undefined) {
					if (data.allStats.length > 0) {
						var resultingStat = data.allStats[0];
						syncPoint.id = resultingStat.id;
						syncPoint.startingStatIndex = resultingStat.statIndex;
						
						// We insert the new sync point so that any subsequent stats taken
						// will use the existing sync point instead of making their own
						options.video.insertSyncPoint(syncPoint);
						
						setVideoSyncPoints(options.video.getId(), options.video.getSyncPoints());
					} else {
					}
				}
				
				var defaultFunction = postResultHandler(DataManager.ADD, additionalData);
				defaultFunction(data, textStatus);
			},
			"json"
		);
	}
	this.addStat = addStat;
	
	function editStat(statObj, statString, additionalData) {
		$.post(
			crudUrl, 
			{
				action: 'Edit Play',
				statsToParse: statString,
				editId: statObj.getId(),
				id: statObj.getGameId()
			},
			postResultHandler(DataManager.EDIT, additionalData),
			"json"
		);
	}
	this.editStat = editStat;
	
	function deleteStat(statObj, additionalData) {
		$.post(
			crudUrl, 
			{
				action: 'Delete Plays',
				existingStat: statObj.getId(),
				id: statObj.getGameId(),
			},
			postResultHandler(DataManager.DELETE, additionalData),
			"json"
		);
	}
	this.deleteStat = deleteStat;
	
	function setLocationData(statObj, locationData, additionalData) {
		$.post(
			crudUrl,
			{
				action: 'setLocationData',
				editId: statObj.getId(),
				locationInformation : JSON.stringify(locationData),
			},
			postResultHandler(DataManager.EDIT, additionalData),
			"json"
		);
	}
	this.setLocationData = setLocationData;
	
	function postResultHandler(whatNotification, additionalData) {
		return function( data, textStatus ) {
			if (textStatus != "success") {
				alert("JSON error: " + testStatus);
			}
			
			var whichNotification = whatNotification;
			if (data.error) {
				// Kaboom? Leave it up to the listeners to notify the user.
				whichNotification = DataManager.ERROR;
			} else {
				DataManager.receiveData(data);
			}
			
			if (data != undefined) {
				data.additionalData = additionalData;
			} else {
				data = {
					additionalData : additionalData,
				}
			}
			
			notify(whichNotification, data);
			
			if (data.warnings) {
				notify(DataManager.WARNING, data);
			}
		}
	}
	this.postResultHandler = postResultHandler;

	/**************************************************************************/
	/**                          Helper Functions                            **/
	/**************************************************************************/
	DataManager.receiveData = function (data, intoArray) {
		
		thisDM.maxPermission = data.maxPermission;
		
		for (var dataEntry in data) {
			if ((dataEntry == "allStats") || (dataEntry == "deletedStats") || (dataEntry == "modifiedStats") || (dataEntry == "gameVideos")) {
				continue;
			}
			if (thisDM[dataEntry] == undefined) {
				thisDM[dataEntry] = data[dataEntry];
			} else {
				for (var i in data[dataEntry]) {
					thisDM[dataEntry][i] = data[dataEntry][i];
				}
			}
		}
		
		if (data.deletedStats != undefined) {
			for (var i in data.deletedStats) {
				deleteStatById(data.deletedStats[i].id);
			}
		}
		
		if (thisDM.game == undefined) {
			thisDM.game = {};
		}
		if (data['currentState'] != undefined) {
			thisDM.game.currentGameState = data['currentState'].id;
			thisDM.gameStates[thisDM.game.currentGameState] = data['currentState'];
		}
		
		if (data.allStats != undefined) {
			if (thisDM.allStats == undefined) {
				thisDM.allStats = [];
			}
			for (var i in data.allStats) {
				data.allStats[i] = new StatEvent(data.allStats[i], thisDM);
				
				if (intoArray != undefined) {
					DataManager.insertStatIn(data.allStats[i], intoArray);
				} else {
					DataManager.insertStatIn(data.allStats[i], thisDM.allStats);
				}
			}
		}
		
		if (data.playlist != undefined) {
			for (var i in data.playlist.entries) {
				if (data.statsById) {
					data.playlist.entries[i].stat = new StatEvent(data.statsById[data.playlist.entries[i].targetStat]);
				}
				data.playlist.entries[i] = new PlaylistEntry(data.playlist.entries[i], thisDM);
			}
		}
		
		if (data.modifiedStats != undefined) {
			for (var i in data.modifiedStats) {
				var stat = data.modifiedStats[i];
				
				modifyStat(stat);
			}
		}
		
		if (data.gameVideos != undefined) {
			for (var i in data.gameVideos) {
				data.gameVideos[i] = new GameVideo(data.gameVideos[i], thisDM, thisDM.syncFromPlaylist);
			}
			if (thisDM.gameVideos == undefined) {
				thisDM.gameVideos = {};
			}
			for (var i in data.gameVideos) {
				if (thisDM.gameVideos[i] == undefined) {
					thisDM.gameVideos[i] = data.gameVideos[i];
				}
			}
		}
	}
	
	function modifyStat(someStat) {
		for (var i in thisDM.allStats) {
			var stat = thisDM.allStats[i];
			if (stat.getId() == someStat.id) {
				stat.initialize(someStat);
				return;
			}
		}
	}
	
	function deleteStatById(someStatId) {
		for (var i in thisDM.allStats) {
			var stat = thisDM.allStats[i];
			if (stat.getId() == someStatId) {
				thisDM.allStats.splice(i, 1);
				return;
			}
		}
	}
	
	DataManager.insertStatIn = function (someStat, intoArray) {
		var insertionIndex = 0;
		while ((insertionIndex < intoArray.length) && 
			   (intoArray[insertionIndex].getGameId() != someStat.getGameId())) 
		{
			insertionIndex++;
		}
		
		// We've found the right game to insert into. Now find the right spot in this group of stats that share the same game ID
		while ((insertionIndex < intoArray.length) && 
			   (intoArray[insertionIndex].getGameId() == someStat.getGameId()) && 
			   ((intoArray[insertionIndex].getTime() < someStat.getTime()) ||
			   ((intoArray[insertionIndex].getTime() == someStat.getTime()) && 
			   (intoArray[insertionIndex].getStatIndex() < someStat.getStatIndex())))) 
		{
			insertionIndex++;
		}
		
		intoArray.splice(insertionIndex, 0, someStat);
	}
	
	/**************************************************************************/
	/**                          Getter Functions                            **/
	/**************************************************************************/
	/// This may be getting called often... this could stand some speed improvements if that's the case.
	/// Memoize?  Addition/deletion might F with the memoized result.
	function getStatById(id) {
		for (index in thisDM.allStats) {
			if (thisDM.allStats[index].getId() == id) {
				return thisDM.allStats[index];
			}
		}
		return null;
	}
	this.getStatById = getStatById;
}