
function SingleEventGroupingMode(dataManager, videoManager, player) {
	var superClass = new NoEventGroupingMode(dataManager, videoManager, player);
	var exports = {};
	var overrides = {
		transitionToFuture : transitionToFuture,
		transitionToAboutTo : transitionToAboutTo,
		transitionToJust : transitionToJust,
		transitionToPast : transitionToPast,
		playEvent : playEvent,
		playFirstVideo : playFirstVideo,
		progressHover : progressHover,
		initEventViewer : initEventViewer,
		initTimelines : initTimelines,
		setEventViewer : setEventViewer,
		registerNotificationFor : registerNotificationFor,
	};
	
	for (var i in superClass) {
        if (superClass.hasOwnProperty(i)) {
            exports[i] = superClass[i];
        }
    }
	
	for (var i in overrides) {
		exports[i] = overrides[i];
	}
	
	function initTimelines() {
		for (var i in dataManager.gameVideos) {
			dataManager.gameVideos[i].registerNotificationFor(Timeline.FUTURE, transitionToFuture);
			dataManager.gameVideos[i].registerNotificationFor(Timeline.ABOUT_TO_HAPPEN, transitionToAboutTo);
			dataManager.gameVideos[i].registerNotificationFor(Timeline.JUST_HAPPENED, transitionToJust);
			dataManager.gameVideos[i].registerNotificationFor(Timeline.PAST, transitionToPast);
		}
	}
	
	function registerNotificationFor(notificationType, notification) {
		for (var i in dataManager.gameVideos) {
			dataManager.gameVideos[i].registerNotificationFor(notificationType, notification);
		}
	}
	
	var eventViewer = undefined;
	
	function initEventViewer(options) {
		setEventViewer(new EventViewer(options.divId, options.dataManager, options));
		eventViewer.setMode(playEvent);

		for (index in options.dataManager.allStats) {
			var stat = options.dataManager.allStats[index];
			if (stat.getPlayable()) {
				$(".stat" + stat.getId()).addClass("seekable");
			} else {
				$(".stat" + stat.getId()).addClass("unseekable").attr("data-toggle", "tooltip").attr("data-original-title", "This stat is not synced to any video.");
			}
		}
		
		return eventViewer;
	}
	
	function setEventViewer(existingViewer) {
		eventViewer = existingViewer;
	}
	
	///////////////////////////////////// Overrides
	
	function playFirstVideo(startingVidId, restoreVideoTime) {
		var firstVideo;
		if (startingVidId != undefined) {
			firstVideo = dataManager.gameVideos[startingVidId];
		} else {
			var i = 0;
			while ((i < dataManager.allStats.length) && (firstVideo == undefined)) {
				var event = dataManager.allStats[i];
				if (event.getPlayable())  {
					firstVideo = event.getPlayableGameVideo();
				}
				i++;
			}
			if (firstVideo == undefined) {
				firstVideo = superClass.playFirstVideo(startingVidId);
			}
		}

		// Restore any saved time for this video
		var timeRequest = 0;
		
		// TODO: move this to local storage
//		var videoTimes = JSON.parse($.cookie("videoTimes"));
//		if (restoreVideoTime && (videoTimes != undefined) && videoTimes != null) {
//			timeRequest = videoTimes[firstVideo.getId()];
//			delete videoTimes[firstVideo.getId()];
//			$.cookie("videoTimes", JSON.stringify(videoTimes));
//		}
		
		videoManager.loadVideo(firstVideo, timeRequest);
	}
	
	function progressHover(percent) {
		var progressInfo = superClass.progressHover(percent);  //Just grabs the time
		
		var currentVideo = videoManager.getCurrentVideo();
		var stateInfo = videoManager.getStateFromVideoTime(currentVideo, percent * currentVideo.getDuration());
		progressInfo.gameState = stateInfo[0];
		progressInfo.currentEvent = stateInfo[1];
		if (stateInfo[1] != undefined) {
			progressInfo.relevantGame = dataManager.games[stateInfo[1].getGameId()];
		}
		
		return progressInfo;
	}
	
	///////////////////////////////////// Transition Functions
	function transitionToFuture(event) {
		eventViewer.unfadeStat(event);
	}
	
	function transitionToAboutTo(event, oldState) {
		if (oldState != Timeline.FUTURE) {
			eventViewer.unfadeStat(event);
		}
	}
	
	function transitionToJust(event, oldState) {
		if (oldState == Timeline.PAST) {
			eventViewer.unfadeStat(event);
		} else {
			eventViewer.highlightStat(event);
		}
		if (!player.inEditMode()) {
			eventViewer.scrollToStat(event);
		}
	}
	
	function transitionToPast(event, oldState, currentTime) {
		var foundEvent = false;
		for (i in dataManager.allStats) {
			if (foundEvent && dataManager.allStats[i].getPlayable()) {
				nextEvent = dataManager.allStats[i];
				foundEvent = false;
			}
			if (dataManager.allStats[i].getId() == event.getId()) {
				foundEvent = true;
			}
		}
		
		var currentVideo = videoManager.getCurrentVideo();
		if (player.isCondenseChecked() && 
			(event.isActionEndingStat()) &&
			(event.getGameId() == nextEvent.getGameId()) &&
			(currentVideo.getEndTimeFor(event) < currentVideo.getSeekTimeFor(nextEvent)) &&
			(currentTime < currentVideo.getSeekTimeFor(nextEvent))) 
		{
			videoManager.setCurrentTime(currentVideo.getSeekTimeFor(nextEvent));
		}
		
		if (event.getPlayable()) {
			eventViewer.fadeStat(event);
		}
	}
	
	function playEvent(event, eventObj, entryId) {
		if (event.getPlayable())  {
			var currentVideo = videoManager.getCurrentVideo();
			
			if ((currentVideo != undefined) && (event.isCoveredBy(currentVideo))) {
				videoManager.setCurrentTime(currentVideo.getSeekTimeFor(event));
			} else {
				// Find a gameVideo to play for this event
				var playableGameVideo = event.getPlayableGameVideo();
				
				if (playableGameVideo == undefined) {
					return;
				}
				
				// Calculate where to jump to, based on the event passed in
				var timeInVideo = playableGameVideo.getSeekTimeFor(event);
				
				videoManager.loadVideo(playableGameVideo, timeInVideo);
			}
		}		
	}
	
	return exports;
}
