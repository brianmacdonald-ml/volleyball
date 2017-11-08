/*
 * Required for all LiveViews
 */
var classname = "ShotChartLiveView";
var version = 1.1;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function ShotChartLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;
	
	var canvasEl;
	var ctx;
	var scalingFactor;
	var centerPlayArea = {};
	
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
	
	function resizeAndShow(fullscreen) {
		resize(fullscreen);
		show();
	}
	this.resize = resizeAndShow;
	
	var image = {
		url : '/images/VolleyballCourt.svg',
		height : 886,
		width : 567,
		object : undefined,
	};
	var displayArea = {
		x : 30,
		y : 100,
		width : 507,
		height : 686,
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
			$("#" + self.targetDivId).css("background-color", "#61995E");
			$("#" + self.targetDivId).append("<audio  id='" + self.targetDivId + "_audio' preload='auto'><source src='/images/alert.oga' type='audio/ogg'/><source src='/images/alert.mp3' type='audio/mpeg'/></audio>");
			$("#" + self.targetDivId).append("<div id='" + self.targetDivId + "' onClick='document.getElementById(\"" + self.targetDivId + "_audio\").play()' class='infoBar'><div>Shot Chart</div></div>");
			$("#" + self.targetDivId).append("<canvas id='" + self.targetDivId + "_canvas' style='position:absolute;left: 1px; top: 31px;'></canvas>");
			
			resize();
			
			canvasEl = document.getElementById(self.targetDivId + "_canvas");
			ctx = canvasEl.getContext('2d');
			
			$(window).resize(function () {
				resizeAndShow();
			});
			
			for (var i in allPlayers) {
				allPlayers[i].registerNotificationFor(Timeline.JUST_HAPPENED, enterPointCollectionMode);
			}
			dataManager.registerForNotification(DataManager.DELETE, manageEditsAndDeletions);
			dataManager.registerForNotification(DataManager.EDIT, manageEditsAndDeletions);
		}
		
		if (!self.valid) {
			var width = $("#" + self.targetDivId).width() + 10;
			var height = $("#" + self.targetDivId).height() - 10;
			$(canvasEl).attr("width", width);
			$(canvasEl).attr("height", height);
			
			$(".infoBar", "#" + self.targetDivId).width(width - 20);
			
			if ((width / displayArea.width) > (height / displayArea.height)) {
				scalingFactor = height / displayArea.height;
			} else {
				scalingFactor = width / displayArea.width;
			}

			ctx.clearRect(0, 0, width, height);
			
			var centerOffset = width / 2 - (displayArea.width * scalingFactor) / 2;
			centerPlayArea.x = width / 2;
			centerPlayArea.y = (image.height / 2 - displayArea.y) * scalingFactor;
			
			if (image.object == undefined) {
				image.object = new Image();  
				image.object.onload = function(){  
					ctx.drawImage(image.object, displayArea.x, displayArea.y, displayArea.width, displayArea.height, centerOffset, 0, displayArea.width * scalingFactor, displayArea.height * scalingFactor);
					
					determineModeAndDraw();
			    };  
			    image.object.src = image.url; // Set source path
			} else {
				ctx.drawImage(image.object, displayArea.x, displayArea.y, displayArea.width, displayArea.height, centerOffset, 0, displayArea.width * scalingFactor, displayArea.height * scalingFactor);
				
				determineModeAndDraw();
			}
		}
		
		self.shown = true;
		self.valid = true;
	}
	this.show = show;
	
	function manageEditsAndDeletions(data) {
		for (var id in data.deletedStats) {
			if ((collectingInfoFor != null) && (collectingInfoFor.getId() == id)) {
				// What if the stat is deleted?  Do we go back to displaying the location info?
				modifyCollectingInfoFor(data.allStats[0]);
				return;
			}
		}
	}
	
	function universalToLocal(universal) {
		var local = {};
		local.x = universal.x * scalingFactor + centerPlayArea.x;
		local.y = universal.y * scalingFactor + centerPlayArea.y;
		
		return local;
	}
	
	function localToUniversal(localX, localY) {
		var universalX = (localX - centerPlayArea.x) / scalingFactor;
		var universalY = (localY - centerPlayArea.y) / scalingFactor;
		
		return [universalX, universalY];
	}
	
	function determineModeAndDraw() {
		var i = dataManager.allStats.length - 1;
		while (0 <= i) {
			var stat = dataManager.allStats[i];
			var statType = dataManager.statTypes[stat.getStatType()];
			if (statType.locationAware) {
				if (stat.getLocationData().length == 0) {
					enterPointCollectionMode(stat);
				} else {
					drawAllLocationData();
				}
				return;
			}
			i--;
		}
	}
	
	// Modes
	function exitMode() {
		var canvas = $("#" + self.targetDivId + "_canvas");
		
		collectingInfoFor = undefined;
		
		canvas.unbind("mousedown");
		canvas.unbind("mouseup");
		canvas.unbind("mousemove");
		canvas.unbind("touchstart");
		canvas.unbind("touchmove");
		canvas.unbind("touchend");
	}
	
	var pointData = [];
	var collectingInfoFor = undefined;
	function enterPointCollectionMode(stat) {
		if (collectingInfoFor != undefined) {
			// Redraw the points already collected
			for (var i in pointData) {
				var universal = {
						x : pointData[i][0],
						y : pointData[i][1],
				}
				var local = universalToLocal(universal);
				drawPointClick(local.x, local.y, collectingInfoFor);
			}
			return;
		}
		
		pointData = [];
		
		modifyCollectingInfoFor(stat);
	}
	
	function modifyCollectingInfoFor(stat) {
		collectingInfoFor = stat;
		
		$(".infoBar div", "#" + self.targetDivId).html("Collection Mode: " + stat.getName());
		document.getElementById(self.targetDivId + "_audio").play();
		
		var canvas = $("#" + self.targetDivId + "_canvas");
		
		canvas.unbind("mousedown");
		canvas.mousedown(canvasMousedown(stat));
	}
	
	function canvasMousedown(stat) {
		var statType = dataManager.statTypes[stat.getStatType()];
		
		return function (event) {
			var canvas = $("#" + self.targetDivId + "_canvas");
			var offset = canvas.offset();
			var clickX = event.pageX - offset.left; 
			var clickY = event.pageY - offset.top;
			
			drawPointClick(clickX, clickY, stat);
			
			var newLength = pointData.push(localToUniversal(clickX, clickY));
			
			if (newLength == statType.pointCount) {
				// Submit location information
				dataManager.setLocationData(stat, pointData);
				exitMode();
			}
		}
	}
	
	function drawAllLocationData() {
		$(".infoBar div", "#" + self.targetDivId).html("Shot Chart");
		
		var i = dataManager.allStats.length - 1;
		while (0 <= i) {
			var stat = dataManager.allStats[i];
			if (stat.getLocationData().length > 0) {
				drawLocationData(stat);
			}
			i--;
		}
	}
	
	function drawLocationData(stat) {
		var statType = dataManager.statTypes[stat.getStatType()];
		if (statType.pointCount == 1) {
			var local = universalToLocal(stat.getLocationData()[0]);
			drawPointClick(local.x, local.y, stat);
		} else {
			for (var i = 1; i < stat.getLocationData().length; i++) {
				var localPrev = universalToLocal(stat.getLocationData()[i - 1]);
				var local = universalToLocal(stat.getLocationData()[i]);
				drawLine(localPrev.x, localPrev.y,
						 local.x, local.y,
						 stat);
			}
		}
	}
	
	function drawLine(startX, startY, endX, endY, stat) {
		var statType = dataManager.statTypes[stat.getStatType()];
		ctx.strokeStyle = stat.getColor();
		ctx.lineWidth = statType.lineWidth ? statType.lineWidth : 2;
		ctx.beginPath();
		ctx.moveTo(startX, startY);
		ctx.lineTo(endX, endY);
		ctx.stroke();
	}
	
	function drawPointClick(clickX, clickY, stat) {
		var statType = dataManager.statTypes[stat.getStatType()];
		ctx.beginPath();
		ctx.strokeStyle = stat.getColor();
		ctx.lineWidth = statType.lineWidth ? statType.lineWidth : 2;
		if ((statType.shape == undefined) || (statType.shape == "CIRCLE") || (statType.shape == "POINT")) {
			ctx.arc(clickX, clickY, 5, 0, 2 * Math.PI, false);
		}
		ctx.stroke();
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
}

