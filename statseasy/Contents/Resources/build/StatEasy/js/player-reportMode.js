
function ReportMode(dataManager, videoManager, player) {
	var statTimeline;
	var superClass = new SingleEventGroupingMode(dataManager, videoManager, player);
	var exports = {
		playFirstVideo : playFirstVideo,
		progressHover : progressHover,
		progressClicked : progressClicked,
		time_update : time_update,
		initEventViewer : initEventViewer,
		initTimelines : initTimelines,
		updateTimeline : updateTimeline,
		setEventViewer : setEventViewer,
		registerNotificationFor : registerNotificationFor,
	};
	
	for (var i in superClass) {
        if (superClass.hasOwnProperty(i) && (exports[i] == undefined)) {
            exports[i] = superClass[i];
        }
    }
	
	function initTimelines(events, transitionToPastFunction) {
		if (events == undefined) {
			events = dataManager.allStats;
		}
		if (transitionToPastFunction == undefined) {
			transitionToPastFunction = transitionToPast;
		}
		
		statTimeline = setupTimeline(events);
		
		statTimeline.registerNotificationFor(Timeline.PAST, transitionToPastFunction);
		statTimeline.registerNotificationFor(Timeline.FUTURE, superClass.transitionToFuture);
		statTimeline.registerNotificationFor(Timeline.ABOUT_TO_HAPPEN, superClass.transitionToAboutTo);
		statTimeline.registerNotificationFor(Timeline.JUST_HAPPENED, superClass.transitionToJust);
	}
	
	function registerNotificationFor(notificationType, notification) {
		statTimeline.registerNotificationFor(notificationType, notification);
	}
	
	var eventViewer = undefined;
	
	function initEventViewer(options) {
		var eventViewer = superClass.initEventViewer(options);
		
		eventViewer.setMode(playEvent);
		
		setEventViewer(eventViewer);
		
		return eventViewer;
	}
	
	function setEventViewer(existingViewer) {
		eventViewer = existingViewer;
		superClass.setEventViewer(existingViewer);
		eventViewer.setMode(playEvent);
	}
	
	function playEvent(event, eventObj, entryId) {
		var statTime = statTimeline.getSeekTimeFor(event);
		statTimeline.userRequestedTimeTransition(statTime);
		superClass.playEvent(event, eventObj, entryId);
	}
	
	function time_update() {
		var currentVideo = videoManager.getCurrentVideo();
		var currentTime = videoManager.getCurrentTime();
		var time = statTimeline.getSameTimeWithMinimalJump(currentVideo.getTimeline(), currentTime);
		var duration = statTimeline.getDuration();
		
		if (0 <= time) {
			statTimeline.setCurrentTime(time);
		}
		
		return time / duration;
	}
	
	function playFirstVideo() {
		var firstEvent = statTimeline.getFirstEvent();

		superClass.playEvent(firstEvent.obj);
	}
	
	function progressClicked(percent) {
		var statTime = percent * statTimeline.getDuration();
		statTimeline.userRequestedTimeTransition(statTime);
		var relevantEvent = statTimeline.getContainingEvent(statTime).obj;
		var currentVideo = videoManager.getCurrentVideo();
		
		if (relevantEvent.isCoveredBy(currentVideo)) {
			videoManager.setCurrentTime(currentVideo.getSameTimeAs(statTimeline, statTime));
		} else {
			var playableGameVideo = relevantEvent.getPlayableGameVideo();
			if (playableGameVideo == undefined) {
				return;
			}
			
			// Calculate where to jump to, based on the event passed in
			var timeInVideo = playableGameVideo.getSameTimeAs(statTimeline, statTime);
			
			videoManager.loadVideo(playableGameVideo, timeInVideo);
		}
	}
	
	function progressHover(percent) {
		var gameState;
		var progressTime = percent * statTimeline.getDuration();
		var relevantEvent = statTimeline.getContainingEvent(progressTime).obj;
		if (relevantEvent == undefined) {
			gameState = dataManager.allStats[0].getBeginningGameState();
			relevantEvent = dataManager.allStats[0];
		} else {
			var statEventTime = statTimeline.getTimeFor(relevantEvent);
			if (progressTime < statEventTime) {
				gameState = relevantEvent.getBeginningGameState();
			} else {
				gameState = relevantEvent.getEndingGameState();
			}
		}
		relevantGame = dataManager.games[relevantEvent.getGameId()];
		
		return {
			relevantGame : relevantGame,
			gameState : gameState,
			time: progressTime,
			currentEvent : relevantEvent,
		};
	}
	
	function fadeStat(event) {
		eventViewer.fadeStat(event);
	}
	
	function transitionToPast(event, oldState, currentTime, userRequested) {
		var currentVideo = videoManager.getCurrentVideo();
		
		eventViewer.fadeStat(event);
		
		// Only process transitions for events that are covered by this video.
		if (!event.isCoveredBy(currentVideo) || userRequested) {
			return;
		}
		
		var firstEvent = statTimeline.getFirstEvent().obj;
		var nextEvent = statTimeline.getNextMatchingEvent(event, function (someEvent) {
			return someEvent.getPlayable();
		});
		
		if (nextEvent != undefined) {
			var videoTime = videoManager.getCurrentTime();
			
			// Only test the endTime < seekTime if the current video covers the stat
			if (!nextEvent.isCoveredBy(currentVideo) || 
				(!event.canContinuouslyPlayTo(nextEvent) && 
				(videoTime < currentVideo.getSeekTimeFor(nextEvent) || (videoTime > currentVideo.getEndTimeFor(nextEvent))))) 
			{
				// If the current time doesn't fall within the boundaries of the next stat,
				// jump to the next stat... otherwise, we just keep playing
				superClass.playEvent(nextEvent);
			}
		} else {
			statTimeline.userRequestedTimeTransition(0);
			superClass.playEvent(firstEvent);
		}
	}
	
	function updateTimeline(events){
		// Update statTimeline if events' properties have changed
		var nextTime = 0;
		var previousEvent = undefined;
		
		for (eventIndex in events) {
			var thisEvent = events[eventIndex];
			var seekTimeOffset = thisEvent.getSeekTimeOffset();
			var endTimeOffset = thisEvent.getEndTimeOffset();
			
			if (!thisEvent.getPlayable()) {
				seekTimeOffset = 0;
				endTimeOffset = 0;
			}
			
			// If the timeframes of the previous event and this event overlap
			// at all, then the stat timeline should also reflect this.
			if ((previousEvent != undefined) && 
				previousEvent.canContinuouslyPlayTo(thisEvent)) 
			{
				var previousEventTime = statTimeline.getTimeFor(previousEvent);
				nextTime = previousEventTime + (thisEvent.getTime() - previousEvent.getTime());
				statTimeline.updateEvent(thisEvent, nextTime, seekTimeOffset, endTimeOffset);
			} else {
				nextTime = nextTime - seekTimeOffset;
				statTimeline.updateEvent(thisEvent, nextTime, seekTimeOffset, endTimeOffset);
			}
			
			nextTime = nextTime + endTimeOffset;
			
			previousEvent = thisEvent;
		}
	}
	
	function setupTimeline(events) {
		// Add all stats to the stat timeline
		var nextTime = 0;
		var previousEvent = undefined;
		var newTimeline = new Timeline();
		
		for (eventIndex in events) {
			var thisEvent = events[eventIndex];
			var seekTimeOffset = thisEvent.getSeekTimeOffset();
			var endTimeOffset = thisEvent.getEndTimeOffset();
			
			if (!thisEvent.getPlayable()) {
				seekTimeOffset = 0;
				endTimeOffset = 0;
			}
			
			// If the timeframes of the previous event and this event overlap
			// at all, then the stat timeline should also reflect this.
			if ((previousEvent != undefined) && 
				previousEvent.canContinuouslyPlayTo(thisEvent)) 
			{
				var previousEventTime = newTimeline.getTimeFor(previousEvent);
				nextTime = previousEventTime + (thisEvent.getTime() - previousEvent.getTime());
				newTimeline.addEvent(
					thisEvent,
					nextTime,
					seekTimeOffset,
					endTimeOffset
				);
			} else {
				nextTime = nextTime - seekTimeOffset;
				newTimeline.addEvent(
					thisEvent, 
					nextTime,
					seekTimeOffset, 
					endTimeOffset
				);
			}
			
			nextTime = nextTime + endTimeOffset;
			
			
			previousEvent = thisEvent;
		}
		
		return newTimeline;
	}
	
	return exports;
	
}
