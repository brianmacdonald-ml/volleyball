/*
 * Required for all LiveViews
 */
var classname = "ClipEditorLiveView";
var version = 1.0;

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

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function ClipEditorLiveView(myTargetDivId, dataManager) {
	var self = this;
	var dataManager = dataManager;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;
	
	var playlistOverview;
	var scrubBar;

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
	
	
	function resize(fullscreen) {
		var offset = $("#" + self.targetDivId).offset();
		var width = window.innerWidth - offset.left - 30;
		var height = window.innerHeight - offset.top - 40;
	
		if (height < 500) {
			height = 500;
		}
	
		if (!fullscreen) {
			$("#" + self.targetDivId).width(width);
			$("#" + self.targetDivId).height(height);
		} else {
			$("#" + self.targetDivId).width("auto");
			$("#" + self.targetDivId).height("100%");
		
			width = $("#" + self.targetDivId).width();
			height = $("#" + self.targetDivId).height();
		}
	
		self.valid = false;
	}
		
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {		
		if(!dataManager.player){
			alert("Clip Editor Live View not available from this page");
		}else{
			dataManager.player.registerNotificationFor(Timeline.ABOUT_TO_HAPPEN, handleClipChange);
			
			if (self.shown && self.valid) {
				return;
			}
			
			if (!self.shown) {
				var parentDiv = $("#" + self.targetDivId);
				parentDiv.append("<div class='infoBar'><div>Clip Editor</div></div>");

				scrubBar = new ClipEditorScrubBar();
				parentDiv.append(scrubBar.getDiv());
				initFirstClip();
				
				resize();
			}
			self.shown = true;
			self.valid = true;
		}
	}
	this.show = show;
	
	function initFirstClip(){
		var firstStat = dataManager.playlist.entries[0];
		handleClipChange(firstStat);
	}
	
	function handleClipChange(currentStat,happened,currentTime){
		if(scrubBar.getCurrentStat() != null && scrubBar.getCurrentStat().getId() == currentStat.getId()){
			return;
		}
		var statName = currentStat.getName();
		var startTime = currentStat.getSeekTime();
		var endTime = currentStat.getEndTime();
		var clipLength = endTime - startTime;
		var paddingRatio = 1.0/6.0;
		var padding = clipLength*paddingRatio; //add arbitrary time padding to fit active bar within scrub timeline
		var timelineStart = (startTime > padding)? startTime - padding : 0; //make sure timelineStart is >= 0
		var timelineEnd = endTime + padding;
		var currentVideo = dataManager.player.getCurrentVideo();
		
		scrubBar.setCurrentStat(currentStat);
		scrubBar.setStatName(statName);
		scrubBar.setTimelineStart(timelineStart);
		scrubBar.setTimelineEnd(timelineEnd);
		scrubBar.updateIndexBar();
		scrubBar.setCurrentVideo(currentVideo);
	}
	
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
	
	
	function savePlaylist(){
		var toSend = {};
		var playlistId = dataManager.playlist.id;
		if (playlistId != undefined) {
			toSend.id = playlistId;
		}
		toSend.name = dataManager.playlist.name;
		toSend.entries = [];

		var entries = dataManager.playlist.entries;
		for (var i in entries) {
			toSend.entries.push({
				index : i,
				targetStat : entries[i].stat.getId(),
				targetVideo : entries[i].getPlayableGameVideo().getId(),
				startTime : entries[i].startTime,
				time : entries[i].time,
				endTime : entries[i].endTime,
			});
		}

		dataManager.savePlaylist(toSend, function(){
		});
	}
	
	
	
	function ClipEditorScrubBar(){		
		divObject = $("<div class='scrubBar'></div>");
		
		//GUI Elements
		var statNameDisplay;
		var scrubBarTimeline;
		var scrubBarIndex;
		var startTick;
		var endTick;
		var activeTimeline;
		var startField;
		var endField;
		var zoomIn;
		var zoomOut;
		
		//State Variables
		var currentStat = null;
		var timelineStart = 0;
		var timelineEnd = 0;
		var timelineLength = 0;
		var currentVideo = null;
		var currentVideoDuration = 0;
		
		initScrubBar();
		
		
		function initScrubBar(){
			statNameDisplay = $("<div class='clipEditorStatname'></div>");
			divObject.append(statNameDisplay);
		
			scrubBarTimeline = $("<div class='scrubBarTimeline'></div>");
			scrubBarIndex = $("<div class='scrubBarIndex'></div>");
			scrubBarTimeline.append(scrubBarIndex);
		
			startTick = $("<div class='startTick'></div>");
			startTick.mousedown({'tick':'start'},startScrub);
			scrubBarTimeline.append(startTick);
		
			endTick = $("<div class='endTick'></div>");
			endTick.mousedown({'tick':'end'},startScrub);
			scrubBarTimeline.append(endTick);
		
			activeTimeline = $("<div class='scrubBarActive'></div>");
			scrubBarTimeline.append(activeTimeline);
			divObject.append(scrubBarTimeline);
		
			var timeFields = $("<div class='timeFields'></div>");
			startField = $("<input type='text' class='clipStartField'/>");
			startField.change({startEnd:'start', field: startField},setTimesManually);
			endField = $("<input type='text' class='clipEndField'/>");
			endField.change({startEnd:'end', field: endField},setTimesManually);
			timeFields.append(startField);
			timeFields.append(endField);
			divObject.append(timeFields);
		
			var zoomControls = $("<div class='zoomControls'></div>");
			zoomIn = $('<div class="zoom-in">+</div>');
			zoomIn.click({direction:'both',amount:1},handleZoomClick);
			zoomOut = $('<div class="zoom-out">-</div>');
			zoomOut.click({direction:'both',amount:-1},handleZoomClick);
			zoomControls.append(zoomIn);
			zoomControls.append(zoomOut);
			divObject.append(zoomControls);
		}
		
		
		function setCurrentStat(newStat){
			currentStat = newStat;
			setStart(currentStat.startTime);
			setEnd(currentStat.endTime);
		}
		this.setCurrentStat = setCurrentStat;
		
		function getCurrentStat(){
			if(currentStat != null){
				return currentStat;
			}
			return null;
		}
		this.getCurrentStat = getCurrentStat;
		
		function setStatName(someName){
			statNameDisplay.html(someName);
		}
		this.setStatName = setStatName;
		
		function setTimelineStart(sometime){
			timelineStart = sometime;
			updateActiveBar();
		}
		this.setTimelineStart = setTimelineStart;
		
		function setTimelineEnd(sometime){
			timelineEnd = sometime;
			updateActiveBar();
		}
		this.setTimelineEnd = setTimelineEnd;
		
		function setStart(sometime){
			startField.val(sometime.toFixed(2));
			updateActiveBar();
		}
		this.setStart = setStart;
		
		function setEnd(sometime){
			endField.val(sometime.toFixed(2));
			updateActiveBar();
		}
		this.setEnd = setEnd;
		
		function setCurrentVideo(someVideo){
			currentVideo = someVideo;
			currentVideoDuration = someVideo.getDuration();
		}
		this.setCurrentVideo = setCurrentVideo;
		
		function getDiv(){
			return divObject;
		}
		this.getDiv = getDiv;
		
		function updateIndexBar(){
			scrubBarIndex.empty();
			var timeLength = timelineEnd - timelineStart;
			
			
			
			var low = Math.floor(timelineStart);
			var high = Math.ceil(timelineEnd);
			
			var indexInterval = 0.25; //minimum interval
			while(timeLength/indexInterval > 10){ //adjust interval if zoomed out
				indexInterval *= 2;
			}
			for(var i=low; i<high+1; i += indexInterval){
				if(i < timelineStart || i > timelineEnd){
					continue;
				}
				var delta = i-timelineStart;
				var percent = (delta/timeLength) * 100;
				var indexElement = $('<div class="indexEntry">'+i+'</div>');
				indexElement.css('left',percent+'%');
				scrubBarIndex.append(indexElement);
			}
		}
		this.updateIndexBar = updateIndexBar;
		
		function setTimesManually(e){
			var data = e.data;
			var startEnd = data.startEnd;
			var inputField = data.field;
			if(startEnd == 'start'){
				currentStat.startTime = parseFloat(inputField.val());
				startField.val(currentStat.startTime.toFixed(2));
			}else{
				currentStat.endTime = parseFloat(inputField.val());
				endField.val(currentStat.endTime.toFixed(2));
			}
			setVideoTime(inputField.val());
			updateActiveBar();
			dataManager.player.updateTimeline();
			savePlaylist();
		}
		
		function updateActiveBar(){
			timelineLength = timelineEnd - timelineStart;
			var percentStart = (currentStat.startTime - timelineStart)/timelineLength;
			var percentEnd = (currentStat.endTime - timelineStart)/timelineLength;
			
			var timelineWidth = scrubBarTimeline.width();
			var startTickPos = (timelineWidth * percentStart);
			startTick.css('left',startTickPos - startTick.width());
			var endTickPos = timelineWidth * percentEnd;
			endTick.css('left',endTickPos);
			
			activeTimeline.css('left',startTickPos);
			activeTimeline.width(endTickPos - startTickPos);
		}
		
		function setTimesFromTicks(){
			var startTickPos = parseInt(startTick.css('left')) + startTick.width();
			var percentStart = startTickPos/scrubBarTimeline.width();
			currentStat.startTime = timelineStart + (timelineLength * percentStart);
			startField.val(currentStat.startTime.toFixed(2));
			
			var endTickPos = parseInt(endTick.css('left'));
			var percentEnd = endTickPos/scrubBarTimeline.width();
			currentStat.endTime = timelineStart + (timelineLength * percentEnd);
			endField.val(currentStat.endTime.toFixed(2));
			
			activeTimeline.css('left',startTickPos);
			activeTimeline.width(endTickPos - startTickPos);
			dataManager.player.updateTimeline();
			
		}
		
		function setVideoTime(sometime){
			dataManager.player.setCurrentTime(sometime);
		}
		
		function updateVideoTimeFromTick(tick){
			if(tick == 'start'){
				setVideoTime(currentStat.startTime);
			}
			else{
				setVideoTime(currentStat.endTime);
			}
		}
		
		function handleZoomClick(event){
			var direction = event.data.direction;
			var amount = event.data.amount;
			zoom(direction,amount);
		}
		
		function zoom(direction,amount){
			if(direction == 'left' || direction == 'both'){
				var leftAmount = amount;
				if(leftAmount > currentStat.startTime - timelineStart) leftAmount = currentStat.startTime - timelineStart; //make sure you don't zoom in so far that startTime will be off the bar
				timelineStart = (timelineStart+leftAmount > 0)? timelineStart += leftAmount : 0;
			}
			if(direction == 'right' || direction == 'both'){
				var rightAmount = amount;
				if(rightAmount > timelineEnd - currentStat.endTime) rightAmount = timelineEnd - currentStat.endTime; //make sure you don't zoom in so far that endTime will be off the bar
				//TODO: ensure you can't scrub beyond the end of the stat's video
				timelineEnd = (timelineEnd - rightAmount < currentVideoDuration)? timelineEnd -= rightAmount : currentVideoDuration;
			}
			
			updateActiveBar();
			updateIndexBar();
		}
		
		
		var scrubBarLeft;
		var target;
		var startX;
		var startOffsetX;
		var tick;
		function startScrub(e){
			e.preventDefault();
			for (var i in allPlayers) {
				var curPlayer = allPlayers[i];
				curPlayer.pause();
			}
			divObject.addClass('mousedown');
			tick = e.data.tick;
			scrubBarLeft = scrubBarTimeline.offset().left;
			target = $(this);
			startX = e.pageX;
			startOffsetX = e.offsetX;
			
			$(window).mousemove(handleMove);
				
			$(window).mouseup(function(e){
				$(window).unbind();
				divObject.removeClass('mousedown');
				savePlaylist();
			});
		}
		
		function handleMove(e){
			e.preventDefault();
			var newMouseX = e.pageX;
			var newTargetLeft = newMouseX - scrubBarLeft - startOffsetX;
			var newTargetRight = newTargetLeft + target.width();
			//Make sure tick is within bounds of scrub bar
			if(newTargetRight < 0){
				newTargetLeft = -target.width();
			}
			else if(newTargetLeft > scrubBarTimeline.width()){
				newTargetLeft = scrubBarTimeline.width();
			}
			//Check to make sure start tick is not to the right of end tick & vice versa
			if(tick === 'start' && newTargetRight > parseInt(endTick.css('left'))){
				newTargetLeft = parseInt(endTick.css('left')) - target.width();
			}
			else if(tick === 'end' && newTargetLeft < parseInt(startTick.css('left'))+startTick.width()){
				newTargetLeft = parseInt(startTick.css('left'))+startTick.width();
			}
			target.css('left',newTargetLeft);
			
			setTimesFromTicks();
			updateVideoTimeFromTick(tick);
		}
	}

}

