
function LiveViewManager() {
}

LiveViewManager.oldActiveView = undefined;
LiveViewManager.allLiveViews = [];

LiveViewManager.changeLiveViewByIndex = function(index) {
	return function (event) {
		LiveViewManager.changeLiveViews(event, LiveViewManager.allLiveViews[index]);
	};
}

LiveViewManager.drawLiveViewContainer = function(inThisId, allLiveViews) {
	LiveViewManager.allLiveViews = allLiveViews;
	
	if (allLiveViews.length == 0) {
		return;
	}
	
	var liveViewMenu = "<div class='liveViewMenu'><ul>";
	var liveViewDrawDivs = "";
	for (i in allLiveViews) {
		liveViewMenu += "<li><a href='#' id='" + allLiveViews[i].className + 
			"_Link'>" + allLiveViews[i].displayName + "</a></li>";
		liveViewDrawDivs += "<div class='liveViewContent' id='" + 
			allLiveViews[i].className + "_Div'></div>";
	}
	liveViewMenu += "</ul></div>";

	$(inThisId).append(liveViewMenu);
	$(inThisId).append("<div class='commonContainer'><div class='commonOptions'><img src='/images/fullscreen.png' class='fullscreenOption'/></div>" + liveViewDrawDivs + "</div>");
	
	$(".fullscreenOption", inThisId).click(function () {
		var fullscreenEl = this.parentElement.parentElement.parentElement; 
		
		window.scroll(0,0);
		$(fullscreenEl).toggleClass("fullScreen");
		if (LiveViewManager.oldActiveView && LiveViewManager.oldActiveView.object.resize) {
			LiveViewManager.oldActiveView.object.resize($(fullscreenEl).hasClass("fullScreen"));
		}
	});
	
	for (var i in allLiveViews) {
		$("#" + allLiveViews[i].className + "_Link").click(LiveViewManager.changeLiveViewByIndex(i));
		if (allLiveViews[i].object.prepareToShow != undefined) {
			allLiveViews[i].object.prepareToShow();
		}
	}
	
	var previousClassName = $.cookie("liveViewClassName");
	var previousLiveView = allLiveViews[allLiveViews.length - 1];
	if (previousClassName != undefined && previousClassName != null) {
		for (var i in allLiveViews) {
			var someLiveView = allLiveViews[i];
			if (someLiveView.className == previousClassName) {
				previousLiveView = someLiveView;
			}
		}
	}
	
	for (var i in allLiveViews) {
		$("#" + allLiveViews[i].className + "_Div").resizable({
			stop: function () {
				allLiveViews[i].object.invalidate();
				allLiveViews[i].object.show();
			}
		});
	}
	
	
	LiveViewManager.changeLiveViews(null, previousLiveView);
}

LiveViewManager.changeLiveViews = function(event, newActiveView) {
	$.cookie("liveViewClassName", newActiveView.className);
	
	if (LiveViewManager.oldActiveView != undefined) {
		var oldActiveLink = document.getElementById(LiveViewManager.oldActiveView.className + '_Link');
		var oldActiveDiv = document.getElementById(LiveViewManager.oldActiveView.className + '_Div');
		oldActiveLink.setAttribute("class", "");

		try {
			LiveViewManager.oldActiveView.object.stopShowing();
		} catch (e) {
			alert(e);
		}
		oldActiveDiv.setAttribute("class", "liveViewContent");
	}
	LiveViewManager.oldActiveView = newActiveView;
	var newActiveLink = document.getElementById(newActiveView.className + '_Link');
	var newActiveDiv = document.getElementById(newActiveView.className + '_Div');
	
	newActiveLink.setAttribute("class", "active");
	newActiveDiv.setAttribute("class", "activeContent");

	try {
		newActiveView.object.show();
	} catch (e) {
		alert(e);
	}
	
	if (!$(".liveViewContainer").hasClass("fullScreen")) {
		$("#statsToParse").focus();
	}
	
	if (event != null) {
		event.preventDefault();
	}
}

LiveViewManager.notifyNewData = function() {
	// Let all LiveViews know they're showing stale data
	for (i in LiveViewManager.allLiveViews) {
		LiveViewManager.allLiveViews[i].object.invalidate();
	}
	
	if (LiveViewManager.oldActiveView != undefined) {
		LiveViewManager.oldActiveView.object.show();
	}
}
