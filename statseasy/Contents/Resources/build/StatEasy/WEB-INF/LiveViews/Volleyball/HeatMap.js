/*
 * Required for all LiveViews
 */
var classname = "HeatMapLiveView";
var version = 1.0;

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function HeatMapLiveView(myTargetDivId, myPlayerShortcuts, myStatShortcuts, allStats, currentGameState) {
	this.targetDivId = myTargetDivId;
	
	/*
	 * We only need this much info since this is what we're displaying
	 */
	this.playerShortcuts = myPlayerShortcuts;
	this.allStats = allStats;
	
	this.targetStat = undefined;
	for (i in myStatShortcuts) {
		if (myStatShortcuts[i].name.indexOf("Locational") != -1) {
			this.targetStat = myStatShortcuts[i];
		}
	}
	
	this.shown = false;
}

/* 
 * Do some quick setup.  Should not be long running, we don't want to delay 
 * other LiveViews.  This will be called on page startup.  This might not be
 * necessary, since any non-long running tasks should really be done in the 
 * constructor.  Or maybe we execute these after the window is done being 
 * displayed
 */
function HeatMapLiveView_prepareToShow() {
}
HeatMapLiveView.prototype.prepareToShow = HeatMapLiveView_prepareToShow;

HeatMapLiveView.prototype.getPositionCoords = function (position) {
	var height = 360;
	var width = 180;
	var rect = {
		'top' : 0,
		'left' : 0,
		'height' : height / 3,
		'width' : width / 3,
	};
	
	if (2 <= position && position <= 4) {
		rect.top = height / 3;
		rect.height = height / 6;
	}
	
	if (position == 3 || position == 6) {
		rect.left = width / 3;
	} else if (position == 5 || position == 4) {
		rect.left = 2 * width / 3;
	}
	
	return rect;
}

HeatMapLiveView.prototype.drawHeat = function (rect, pct) {
	var canvas = $("#heatMap").get(0);
	var ctx = canvas.getContext("2d");
	var height = rect.height * pct;
	
	ctx.save();
	
	ctx.fillStyle = 'rgba(150, 10, 10, .75)';
	ctx.fillRect(
		rect.left + (rect.width / 2),
		rect.top + rect.height - height, 
		rect.width / 2,
		height
	);
	
	ctx.translate(
		rect.left + 3 * rect.width / 4 + 5,
		rect.top + .9 * rect.height
	);
	ctx.rotate(Math.PI * 3 / 2);
	
	ctx.fillStyle = "white";
	ctx.shadowOffsetX = 1;
	ctx.shadowOffsetY = 1;
	ctx.shadowBlur = 0;
	ctx.shadowColor = "black";
	ctx.fillText(pct.toFixed(3), 0, 0);
  
	ctx.restore();
}

HeatMapLiveView.prototype.clearMap = function () {
	var canvas = $("#heatMap").get(0);
	var ctx = canvas.getContext("2d");
	ctx.clearRect(0, 0, 180, 360);
}

HeatMapLiveView.prototype.drawMap = function () {
	var playerId = $(".selector option:selected").val();
	var total = 0;
	var positionCount = [0, 0, 0, 0, 0, 0, 0];
	
	this.clearMap();
	
	if (this.targetStat != undefined) {
		for (i in this.allStats) {
			if (this.allStats[i].statType.id == this.targetStat.id &&
				(this.allStats[i].statData[0].player.id == playerId || 
				 playerId == -1)) 
			{
				positionCount[this.allStats[i].statData[1].numericalData]++;
				total++;
			}
		}
	}
	
	var position = 1;
	while (position <= 6) {
		var rect = this.getPositionCoords(position);
		if (total > 0) {
			this.drawHeat(rect, positionCount[position] / total);
		} else {
			this.drawHeat(rect, 0);
		}
		position++;
	}
}

/* 
 * This is to actually do any required long running tasks.  This is when 
 * we're going to be shown.
 */ 
function HeatMapLiveView_show() {
	if (this.shown) {
		return;
	}
	
	var relevantDiv = document.getElementById(this.targetDivId);
	var innerHtml = "";
	
	/*
	 * Populate the DIV with Player Info!
	 */
	innerHtml += "<div class='selector'>All hits by <select class='players'>";
	innerHtml += "<option value='-1'>All Players</option>";
	for (i in this.playerShortcuts) {
		var player = this.playerShortcuts[i];
		innerHtml += "<option value='" + player.id + "'>" + player.firstName + " " + player.lastName + "</option>";
	}
	innerHtml += "</select></div>";
	
	/*
	 * Populate the DIV with rotation info!
	 */
	innerHtml += "<table class='court' style='padding:0px' cellspacing='0'>" +
		"<tr class='opponent-backrow'><td>1</td><td>6</td><td>5</td></tr>" + 
		"<tr class='opponent-frontrow'><td>2</td><td>3</td><td>4</td></tr>" + 
		"<tr class='our-frontrow'><td>4</td><td>3</td><td>2</td></tr>" + 
		"<tr class='our-backrow'><td>5</td><td>6</td><td>1</td></tr>" + 
		"</table><div style='clear:both'></div><canvas id='heatMap'></canvas>";
	
	relevantDiv.innerHTML = innerHtml;
	
	// Need to wait for it to be drawn...this seems like it should be done with
	// .ready, but no.  The timeout is a hack	
	var me = this;	
	setTimeout(function () {
		var court = $(".court");
		var heatMap = $("#heatMap");
		heatMap.css({
			//'border' : '1px solid red',
			'position' : 'absolute',
			'top' : court.offset().top + "px",
			'left' : court.offset().left + "px",
		});
		
		// Can't use CSS width and height.  Drawings don't render correctly in the canvas
		heatMap.get(0).setAttribute('width', court.width() + "px");
		heatMap.get(0).setAttribute('height', court.height() + "px");
		
		me.drawMap();
			
		$(".selector").change(function () {
			me.drawMap();
		});
	
	}, 100);
	
	
	this.shown = true;
}
HeatMapLiveView.prototype.show = HeatMapLiveView_show;

/*
 * If we kicked off any background processes, now would be the time to stop 
 * them since we're about to go away.
 */
function HeatMapLiveView_stopShowing() {
}
HeatMapLiveView.prototype.stopShowing = HeatMapLiveView_stopShowing;