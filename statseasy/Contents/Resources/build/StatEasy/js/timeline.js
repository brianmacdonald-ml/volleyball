
function Timeline() {
	
	var events = [];
	var eventsById = {};
	
	var duration = undefined;
	var userRequested = true;
	
	/*****
	 * Notifications
	 ****/
	Timeline.UNDEFINED = 0;
	Timeline.FUTURE = 1;
	Timeline.ABOUT_TO_HAPPEN = 2;
	Timeline.JUST_HAPPENED = 3;
	Timeline.PAST = 4;
	
	var registeredNotifications = [];
	
	/***************************************************************************
	 *                         Adding/Recalling Events
	 **************************************************************************/
	/**
	 * Which event has the most appropriate state to use?
	 */
	function mostStateRelevantEvent(someTime) {
		var insIndex = getInsertionIndex(someTime);
		
		// If the time represents the earliest event, then return the first event
		if (insIndex == 0) {
			if (events.length > 0) {
				return events[0].obj;
			} else {
				return;
			}
		}
		
		var nextEvent;
		if (insIndex >= events.length) {
			nextEvent = events[events.length - 1];
		} else {
			nextEvent = events[insIndex];
		}
		
		// If we're within the seek time of the next event, then it is most
		// correct to use the beginning state of the next event rather than the
		// ending state of the previous event
		if (nextEvent.seekTime < someTime) {
			return nextEvent.obj;
		} else {
			return events[insIndex - 1].obj;
		}
	}
	this.mostStateRelevantEvent = mostStateRelevantEvent;
	
	/**
	 * Get the latest event that happened before someTime or undefined if nothing
	 * happened before someTime;
	 */
	function justHappenedBefore(someTime) {
		var insIndex = getInsertionIndex(someTime);
		if (insIndex == 0) {
			return undefined;
		}
		return events[insIndex - 1].obj;
	}
	this.justHappenedBefore = justHappenedBefore;
	
	function getAllEvents() {
		return events;
	}
	this.getAllEvents = getAllEvents;
	
	/**
	 * Find the earliest event whose seekTime is before someTime and whose endTime 
	 * is after someTime
	 * 
	 * I need a better algorithm than linear search!  I could index based on seekTime and endTime...hmm
	 */
	function getContainingEvent(someTime) {
		var earliestSatisfyingEvent = undefined;
		var i = 0;
		
		while ((i < events.length) && (earliestSatisfyingEvent == undefined)) {
			var testEvent = events[i];
			if ((testEvent != undefined) && (testEvent.seekTime <= someTime) && (someTime <= testEvent.endTime)) {
				earliestSatisfyingEvent = testEvent;
			}
			i++;
		}
		
		return earliestSatisfyingEvent != undefined ? earliestSatisfyingEvent : undefined;
	}
	this.getContainingEvent = getClosestEvent;  // We use getClosestEvent here because this helps with time calculations when a timeline is outside of a statistic
	
	function getClosestEvent(someTime) {
		if (events.length == 0) {
			return undefined;
		}
		
		var closestMatch = events[0];
		var closestTime = Math.abs(someTime - events[0].time);
		
		var i = 1;
		while (i < events.length) {
			var newDelta = Math.abs(someTime - events[i].time);
			if (newDelta < closestTime) {
				closestMatch = events[i];
				closestTime = newDelta;
			}
			i++;
		}
		
		return closestMatch;
	}
	
	function getAllContainedEvents(someTime, fudgeFactor) {
		var containedEvents = [];
		
		for (var i in events) {
			var testEvent = events[i];
			if ((testEvent.seekTime - fudgeFactor <= someTime) && (someTime <= testEvent.endTime + fudgeFactor)) {
				containedEvents.push(testEvent.obj);
			}
		}
		
		return containedEvents;
	}
	this.getAllContainedEvents = getAllContainedEvents;
	
	/**
	 * Get the seekTime that someEvent occurred in this timeline
	 * @param someEvent
	 */
	function getSeekTimeFor(someEvent, timeHint) {
		return getEventInfo(someEvent, timeHint).seekTime;
	}
	this.getSeekTimeFor = getSeekTimeFor;
	
	/**
	 * Get the time that someEvent occurred in this timeline
	 * @param someEvent
	 */
	function getTimeFor(someEvent, timeHint) {
		return getEventInfo(someEvent, timeHint).time;
	}
	this.getTimeFor = getTimeFor;
	
	/**
	 * Get the time that someEvent occurred in this timeline
	 * @param someEvent
	 */
	function getEndTimeFor(someEvent, timeHint) {
		return getEventInfo(someEvent, timeHint).endTime;
	}
	this.getEndTimeFor = getEndTimeFor;
	
	/**
	 * Add an event to the timeline
	 * @param someEvent The event to add
	 * @param time The time that this event will be added
	 * @param seekTimeOffset The amount of time before time that this event begins
	 * @param endTimeOffset The amount of time before time that this event ends
	 */
	function addEvent(someEvent, time, seekTimeOffset, endTimeOffset) {
		var insertMe = {
			obj: someEvent,
			time : time,
			seekTime : time + seekTimeOffset,
			endTime : time + endTimeOffset,
			happened : Timeline.UNDEFINED,
		};
		events.splice(getInsertionIndex(time), 0, insertMe);
		eventsById[getEventId(someEvent)] = insertMe;
		duration = undefined;
	}
	this.addEvent = addEvent;
	
	function updateEvent(someEvent, time, seekTimeOffset, endTimeOffset){
		var updateMe = eventsById[getEventId(someEvent)];
		updateMe.obj = someEvent;
		updateMe.time = time;
		updateMe.seekTime = time + seekTimeOffset;
		updateMe.endTime = time + endTimeOffset;
		duration = undefined;
	}
	this.updateEvent = updateEvent;
	
	function getEventId(object) {
		if (object.getId != undefined) {
			return object.getId();
		} else {
			return object.id;
		}
	}
	
	function removeEvent(someEventId) {
		for (var i in events) {
			var insertedObj = events[i].obj;
			if (getEventId(insertedObj) == someEventId) {
				events.splice(i, 1);
				break;
			}
		}
		delete eventsById[someEventId];
		duration = undefined;
	}
	this.removeEvent = removeEvent;
	
	/**
	 * Erase all events in this Timeline
	 */
	function clearEvents() {
		events = [];
		eventsById = {};
		duration = undefined;
	}
	this.clearEvents = clearEvents;
	
	/**
	 * Returns the first event by chronological order
	 */
	function getFirstEvent() {
		return events[0];
	}
	this.getFirstEvent = getFirstEvent;
	
	function getNextMatchingEvent(startFrom, matchingFunction) {
		var foundEvent = false;
		var nextEvent = undefined;
		for (var i in events) {
			var thisStat = events[i];
			
			if (foundEvent && matchingFunction(thisStat.obj)) {
				nextEvent = thisStat.obj;
				foundEvent = false;
			}
			if (getEventId(thisStat.obj) == getEventId(startFrom)) {
				foundEvent = true;
			}
		}
		
		return nextEvent;
	}
	this.getNextMatchingEvent = getNextMatchingEvent;
	
	/***************************************************************************
	 *                             Duration Methods
	 **************************************************************************/
	function setDuration(newDuration) {
		duration = newDuration;
	}
	this.setDuration = setDuration;
	
	/**
	 * @return The duration of this timeline.  This will be a calculated duration
	 * unless a duration has been specified by the user.
	 */
	function getDuration() {
		if (duration != undefined) {
			return duration;
		}
		
		var lastEvent = events[events.length - 1];
		return lastEvent.endTime; 
	}
	this.getDuration = getDuration;
	
	var lastCurrentTime = 0;
	function getCurrentTime() {
		return lastCurrentTime;
	}
	this.getCurrentTime = getCurrentTime;
	
	/***************************************************************************
	 *                             Notification Methods
	 **************************************************************************/
	function registerNotificationFor(notificationType, notification) {
		if (!!notification) {
			if(registeredNotifications[notificationType] == undefined){
				registeredNotifications[notificationType] = new Array();
			}
			registeredNotifications[notificationType].push(notification);
		}
	}
	this.registerNotificationFor = registerNotificationFor;
	
	/**
	 * User requested time transitions come from progress bar clicks and event clicks
	 */
	function userRequestedTimeTransition(someTime) {
		userRequested = true;
		lastCurrentTime = someTime;
	}
	this.userRequestedTimeTransition = userRequestedTimeTransition;
	
	function setCurrentTime(someTime) {
		lastCurrentTime = someTime;
		
		for (var i in events) {
			if (someTime < events[i].seekTime) {
				transitionTo(events[i], someTime, Timeline.FUTURE);
			} else if (someTime < events[i].time) {
				transitionTo(events[i], someTime, Timeline.ABOUT_TO_HAPPEN);
			} else if (someTime < events[i].endTime) {
				transitionTo(events[i], someTime, Timeline.JUST_HAPPENED);
			} else {
				transitionTo(events[i], someTime, Timeline.PAST)
			}
		}
		userRequested = false;
	}
	this.setCurrentTime = setCurrentTime;
	
	/***************************************************************************
	 *                             Timeline Translation Methods
	 **************************************************************************/
	function getSameTimeWithMinimalJump(anotherTimeline, timeInOtherTimeline) {
		var otherEvents = anotherTimeline.getAllEvents();
		
		var currentBestGuess = undefined;
		var smallestDelta = undefined;
		for (var i in otherEvents) {
			var otherEvent = otherEvents[i];
			var ourEvent = eventsById[getEventId(otherEvent.obj)];
			if (ourEvent != undefined) {
				// mostRecentEventTime + delta = timeInOtherTimeline
				var deltaFromMostRecent = timeInOtherTimeline - otherEvent.time;
				// The time in our timeline if we calculate the time from otherEvent
				var ourTime = ourEvent.time + deltaFromMostRecent
				
				// We want to find the time in our timeline that is closest to our lastCurrentTime
				if ((currentBestGuess == undefined) || (Math.abs(ourTime - lastCurrentTime) < smallestDelta)) {
					currentBestGuess = ourTime;
					smallestDelta = Math.abs(ourTime - lastCurrentTime);
				}
			}
		}
		
		return currentBestGuess != undefined ? currentBestGuess : timeInOtherTimeline;
	}
	this.getSameTimeWithMinimalJump = getSameTimeWithMinimalJump;
	
	function getSameTimeAs(anotherTimeline, timeInOtherTimeline) {
		var mostRecentEvent = anotherTimeline.getContainingEvent(timeInOtherTimeline);
		if (mostRecentEvent == undefined) {
			mostRecentEvent = anotherTimeline.getFirstEvent();
			if (mostRecentEvent == undefined) {
				// The other timeline doesn't have any entries! 
				// What are we supposed to do?  There is no valid time translation!
				return timeInOtherTimeline;
			}
		}
		var mostRecentEventTime = mostRecentEvent.time;
		// mostRecentEventTime + delta = timeInOtherTimeline
		var deltaFromMostRecent = timeInOtherTimeline - mostRecentEventTime;
		return getTimeFor(mostRecentEvent.obj, lastCurrentTime) + deltaFromMostRecent;
	}
	this.getSameTimeAs = getSameTimeAs;
	
	/***************************************************************************
	 *                             Helpers
	 **************************************************************************/
	function transitionTo(event, currentTime, newState) {
		if (event.happened != newState) {
			if (registeredNotifications[newState] != undefined) {
				for(var i in registeredNotifications[newState]){
					registeredNotifications[newState][i](event.obj, event.happened, currentTime, userRequested);
				}
				//registeredNotifications[newState](event.obj, event.happened, currentTime, userRequested);
			}
			event.happened = newState;
		}
	}
	
	function getInsertionIndex(someTime) {
		return getInsertionIndexHelper(someTime, 0, events.length);
	}
	
	function getInsertionIndexHelper(someTime, lowerBounds, upperBounds) {
		if (upperBounds == lowerBounds) {
			return lowerBounds;
		}
		
		var testIndex = Math.floor((lowerBounds + upperBounds) / 2);
		if (someTime < events[testIndex].time) {
			return getInsertionIndexHelper(someTime, lowerBounds, testIndex);
		} else {
			return getInsertionIndexHelper(someTime, testIndex + 1, upperBounds);
		}
	}
	
	function getEventInfo(someEvent) {
		return eventsById[getEventId(someEvent)];
	}
}