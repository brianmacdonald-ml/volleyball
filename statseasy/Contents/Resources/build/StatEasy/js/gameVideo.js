
function GameVideo(gameVideo, dataManager, syncFromPlaylist) {
	
	var id = gameVideo.id;
	var name = gameVideo.name;
	var segments = gameVideo.segments;
	var syncPoints = gameVideo.syncPoints;
	var eventIds = gameVideo.eventIds;
	var eventGroupingId = gameVideo.eventGroupingId;
	var duration = gameVideo.duration;
	var timeline = new Timeline();
	var coversEventId = {};
	var gvCoverStatId = {};
	
	// TODO: Remove references to filename property.
	
	var self = this;
	
	init();
	
	function getId() {
		return id;
	}
	this.getId = getId;
	
	function getName() {
		return name;
	}
	this.getName = getName;
	
	function getSegments() {
		return segments;
	}
	this.getSegments = getSegments;
	
	function getDuration() {
		return duration;
	}
	this.getDuration = getDuration;
	
	function getTimeline() {
		return timeline;
	}
	this.getTimeline = getTimeline;
	
	function insertSyncPoint(newSync) {
		var newIndex = 0;
		while ((newIndex < syncPoints.length) && (syncPoints[newIndex].time < newSync.time)) {
			newIndex++;
		}
		
		addSyncPoint(newIndex, newSync);
	}
	this.insertSyncPoint = insertSyncPoint;
	
	function addSyncPoint(newIndex, newSync) {
		syncPoints.splice(newIndex, 0, newSync);
		syncAllStats();
	}
	this.addSyncPoint = addSyncPoint;
	
	function removeSyncPoint(index) {
		syncPoints.splice(index, 1);
		syncAllStats();
	}
	this.removeSyncPoint = removeSyncPoint;
	
	function getSyncPoints() {
		return syncPoints;
	}
	this.getSyncPoints = getSyncPoints;
	
	function init() {
		dataManager.registerForNotification(DataManager.ADD, handleAddResult);
		dataManager.registerForNotification(DataManager.EDIT, handleEditResult);
		dataManager.registerForNotification(DataManager.DELETE, handleDeleteResult);
		
		// coversEventId will serve dual purpose. Do we cover the event and what
		// index does the event occur at (assuming the events are given to us in order)
		for (var i in eventIds) {
			var eventId = eventIds[i];
			coversEventId[eventId] = Number(i);
		}
		
		syncAllStats();
	}
	
	function removeStatById(statId) {
		delete gvCoverStatId[statId];
		timeline.removeEvent(statId);
	}
	
	function handleAddResult(data, textStatus) {
		// Add the new ones
		syncStats(data.allStats);
		
		// Delete the old ones
		for (var i in data.deletedStats) {
			var deletedStat = data.deletedStats[i];
			removeStatById(deletedStat.id);
		}
	}
	
	function handleEditResult(data, textStatus) {
		// Should be the same as the add event 
		handleAddResult(data, textStatus);
	}
	
	function handleDeleteResult(data, textStatus) {
		// Should be the same as the add event
		handleAddResult(data, textStatus);
	}
	
	function syncPlaylist() {
		var entries = dataManager.playlist.entries;
		
		for (var i in entries) {
			if (entries[i].targetVideo == id) {
				var startTime = entries[i].startTime;
				var endTime = entries[i].endTime;
				var resultingTime = (startTime + endTime) / 2;
				if (entries[i].time != undefined) {
					resultingTime = entries[i].time;
				}
				
				timeline.addEvent(
					entries[i],
					resultingTime,
					startTime - resultingTime,
					endTime - resultingTime
				);
				
				gvCoverStatId[entries[i].getStat().getId()] = (0 <= resultingTime) && (resultingTime <= duration);
			}
			
			if (coversStatId(entries[i].getStat().getId())) {
				entries[i].getStat().addCoveringVideo(getId());
			} else {
				entries[i].getStat().removeCoveringVideo(getId());
			}
		}
	}
	
	function syncStats(allStats) {
		// Go through all stats, adding them to the video timeline if they 
		// belong to this gameVideo
		for (var eventIndex in allStats) {
			var thisEvent = allStats[eventIndex];
			
			// Add any stat that this gameVideo covers
			if (coversEventId[thisEvent.getGameId()] != undefined) {
				// Find the latest sync point applicable to this event
				var syncIndex = syncPoints.length - 1;
				var currSync = undefined;
				while ((syncIndex >= 0) && (currSync == undefined)) {
					var syncPoint = syncPoints[syncIndex];
					
					// If the sync point is from the same event, then check the statIndex.  
					// Otherwise determine if the syncPoint is for a game earlier in this gameVideo.
					if (((syncPoint.gameId == thisEvent.getGameId()) && (syncPoint.startingStatIndex <= thisEvent.getStatIndex())) || 
						(coversEventId[syncPoint.gameId] < coversEventId[thisEvent.getGameId()]) ||
						(syncIndex == 0)) 
					{
						currSync = syncPoint;
					}
					syncIndex--;
				}
				
				if (currSync == undefined) {
					currSync = {delta: 0};
				}
				
				var resultingTime = thisEvent.getTime() + currSync.delta; 
				timeline.addEvent(
					thisEvent, 
					resultingTime,
					thisEvent.getSeekTimeOffset(),
					thisEvent.getEndTimeOffset()
				);
				
				gvCoverStatId[thisEvent.getId()] = (0 <= resultingTime) && (resultingTime <= duration);
				
			}
			
			if (coversStatId(thisEvent.getId())) {
				thisEvent.addCoveringVideo(getId());
			} else {
				thisEvent.removeCoveringVideo(getId());
			}
		}
	}
	
	function syncAllStats() {
		timeline.clearEvents();
		
		if (syncFromPlaylist) {
			syncPlaylist();
		} else {
			syncStats(dataManager.allStats);
		}
	}
	this.syncAllStats = syncAllStats;
	
	/**
	 * Return the syncPoint that corresponds to videoTime and eventId, if there
	 * is no such syncPoint, return undefined
	 * @param videoTime
	 * @param eventId
	 * @return
	 */
	function getSyncPointForVideoTime(videoTime, eventId) {
		var syncIndex = syncPoints.length - 1;
		var currSync = undefined;
		
		while ((syncIndex >= 0) && (currSync == undefined)) {
			var syncPoint = syncPoints[syncIndex--];
			
			// If the sync point is from the same game, then check the time
			// Otherwise determine if the syncPoint is for a game earlier in this gameVideo
			if (((syncPoint.gameId == eventId) && (syncPoint.time < videoTime)) ||
				(coversEventId[syncPoint.gameId] < coversEventId[eventId])) 
			{
				currSync = syncPoint;
			}
		}
		
		return currSync;
	}
	this.getSyncPointForVideoTime = getSyncPointForVideoTime;
	
	function coversStatId(someStatId) {
		return gvCoverStatId[someStatId];
	}
	this.coversStatId = coversStatId;
	
	////////////////////////////////////////////////////////////////////////////
	//                     Timeline Pass-Through Functions
	////////////////////////////////////////////////////////////////////////////
	function getSeekTimeFor(someEvent) {
		return timeline.getSeekTimeFor(someEvent);
	}
	this.getSeekTimeFor = getSeekTimeFor;
	
	function getTimeFor(someEvent) {
		return timeline.getTimeFor(someEvent);
	}
	this.getTimeFor = getTimeFor;
	
	function getEndTimeFor(someEvent) {
		return timeline.getEndTimeFor(someEvent);
	}
	this.getEndTimeFor = getEndTimeFor;
	
	function mostStateRelevantEvent(someTime) {
		return timeline.mostStateRelevantEvent(someTime);
	}
	this.mostStateRelevantEvent = mostStateRelevantEvent;
	
	function registerNotificationFor(notificationType, notification) {
		return timeline.registerNotificationFor(notificationType, notification);
	}
	this.registerNotificationFor = registerNotificationFor;
	
	function setCurrentTime(someTime) {
		return timeline.setCurrentTime(someTime);
	}
	this.setCurrentTime = setCurrentTime;
	
	function getCurrentTime() {
		return timeline.getCurrentTime();
	}
	this.getCurrentTime = getCurrentTime;
	
	function getSameTimeAs(anotherTimeline, timeInOtherTimeline) {
		var sameTimeAs = timeline.getSameTimeAs(anotherTimeline, timeInOtherTimeline);
		return sameTimeAs <= duration ? sameTimeAs : 0;
	}
	this.getSameTimeAs = getSameTimeAs;
}
