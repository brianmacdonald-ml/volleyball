var betterToolTipController = new betterToolTip();

function toTimeString(numSeconds, precision) {
	var hours = parseInt(numSeconds / 3600);
	if (hours > 0) {
		numSeconds -= hours * 3600;
	}
	var seconds = numSeconds % 60;
	var minutes = parseInt(numSeconds / 60);
	
	var timeString = "";
	if (hours > 0) {
		timeString = hours + ":";
		if (minutes < 10) {
			timeString += "0";
		}
	}
	timeString += minutes + ":";
	if (seconds < 10) {
		timeString += "0";
	}
	timeString += seconds.toFixed(precision);
	
	return timeString;
}

function shortenDateString(dateString){
	if(dateString == ""){
		return dateString;
	}
	var someDate = new Date(dateString)
	var newString = "";
	var month_names = new Array ( );
	month_names[month_names.length] = "Jan";
	month_names[month_names.length] = "Feb";
	month_names[month_names.length] = "Mar";
	month_names[month_names.length] = "Apr";
	month_names[month_names.length] = "May";
	month_names[month_names.length] = "Jun";
	month_names[month_names.length] = "Jul";
	month_names[month_names.length] = "Aug";
	month_names[month_names.length] = "Sep";
	month_names[month_names.length] = "Oct";
	month_names[month_names.length] = "Nov";
	month_names[month_names.length] = "Dec";

	newString += month_names[someDate.getMonth()];
	newString += " " + someDate.getDate();
	newString += ", " + someDate.getFullYear();
	return newString;
}

function decodeFromJava(someText) {
	someText = unescape(someText);
	return someText.replace("+", " ", "g");
}

function editUploadable(number) {
	document.getElementById("editMeLink" + number).style.display = "none";
	document.getElementById("uploadLocator" + number).style.display = "block";
	document.getElementById("editIndicator" + number).value = 1;
}

function errorMessage(someText) {
	if (errorMessage.errorDialog == undefined) {
		errorMessage.errorDialog = $('<div></div>')
			.html("Generic error message")
			.dialog({
				autoOpen: false,
				title: 'Error',
				modal: true,
			});
	}

	errorMessage.errorDialog.html(someText);
	errorMessage.errorDialog.dialog("open");
}

var dialogObject = undefined;
var deleteFunction = undefined;
function deleteObject(jsEvent, eventName, eventId, deleteUrl, options) {
	jsEvent.preventDefault();
	jsEvent.stopPropagation();

	if (options == undefined || !options.doNotEncode) {
		eventName = decodeFromJava(eventName);
		eventName = Encoder.htmlEncode(eventName);
	}
	
	if (dialogObject == undefined) {
		dialogObject = $('<div></div>')
			.html("Generic error message")
			.dialog({
				autoOpen: false,
				title: 'Are you sure?',
				modal: true,
			    height: '300',
			    width: '400',				
				buttons: {
					"Yes, delete it." : function () {
						$(this).dialog("close");
				
						if (deleteFunction != undefined) {
							deleteFunction();
						}
						
					},
					"No, do not delete it." : function () {
						$(this).dialog("close");
					}
				},
			});
	}
	
	dialogObject.html("Are you sure you want to delete " + eventName + "? You cannot undo this action.");
	deleteFunction = function () {
		var formHtml = "<form method='post' action='" + deleteUrl + "'>\
				<input type='hidden' name='action' value='delete'/>\
				<input type='hidden' name='id' value='" + eventId + "'/>";
		
		if (options != undefined) {
			for (var i in options) {
				formHtml += "<input type='hidden' name='" + i + "' value='" + options[i] + "'/>";
			}
		}
		formHtml += "</form>";
		
		var newForm = $(formHtml);
		newForm.appendTo("#innercontent");
		newForm.submit();
	};
	
	dialogObject.dialog("open");
}

/**
 * Return unique values in array.
 * @param element - an array
 * @return unique array
 */
function unique(element) {
    var a = [];
    var l = element.length;
    for(var i=0; i<l; i++) {
      for(var j=i+1; j<l; j++) {
        // If this[i] is found later in the array
        if (element[i] === element[j])
          return element[i];
      }
      a.push(element[i]);
    }
    return "";
};

var hiders = {};
function AutogeneratedHider(tableSelector, numCols, objectName) {
	var autogenerated = $(tableSelector + " .autogenerated");

	hiders[tableSelector] = this;

	var myHtml = "<tr>\
			<td colspan='" + numCols + "' id='contextLink'></td>\
		</tr>";
	$(tableSelector + " .thebottomrow").before(myHtml);
	
	var hiderState = JSON.parse($.cookie("hiderState")) || {};
	
	if (hiderState[tableSelector] == undefined) {
		hiderState[tableSelector] = true;
	}
	
	setContext(hiderState[tableSelector]);
		
	function setContext(show) {
		hiderState[tableSelector] = show;
		$.cookie("hiderState", JSON.stringify(hiderState));
		
		if (show) {
			autogenerated.hide();
		} else {
			autogenerated.show();
		}
		
		var func = "hideAll";
		var showHide = "Hide"
		if (show) {
			func = "showAll";
			showHide = "Show";
		}
		var linkHtml = "<a href='#' onclick='hiders[\"" + tableSelector + "\"]." + func + "(event)'>" + showHide + " " + autogenerated.length + " auto-created " + objectName + "</a>";
		$(tableSelector + " #contextLink").html(linkHtml);
	}

	function hideAll(jsEvent) {
		setContext(true);
		
		jsEvent.preventDefault();
		jsEvent.stopPropagation();
	}
	this.hideAll = hideAll;
	
	function showAll(jsEvent) {
		setContext(false);
		
		jsEvent.preventDefault();
		jsEvent.stopPropagation();
	}
	this.showAll = showAll;

}

function generateWebSocket(url) {
	var webSocket;
	if( window.WebSocket ) {
		webSocket = new WebSocket(url);
	} else {
		webSocket = {};
	}
	
	return webSocket
}


function listenForProgress(url, options, host, protocol) {
    listenForInfo(url, handleNewJSON, options, host, protocol);
}

function listenForStats(url, options, dataManager, host, protocol) {
	listenForInfo(url, function (mostRecent, options) {
		var handlerFunction = dataManager.postResultHandler(mostRecent.type);
		handlerFunction(mostRecent, "success");
	}, options, host, protocol);
}

function listenForInfo(url, callback, options, host, protocol) {
	if (host == null || host == "") {
		host = window.document.location.host;
	}
	
	if (protocol == null || protocol == "") {
		protocol = "wss";
	}
	
	var webSocket = generateWebSocket(protocol + "://" + host + url);
	
	if (options.onopen)
		webSocket.onopen = options.onopen
	
	if (options.onclose)
		webSocket.onclose = options.onclose
	
	webSocket.onerror = function(evt) {
		console.log("There was a problem with the WebSocket connection.");
		console.log(evt);
	}
	
	webSocket.onmessage = function(evt) {
		var newJSON = JSON.parse(evt.data);
		for (var i = 0; i < newJSON.length; i++) {
    		callback(newJSON[i], options);
    	}
	}
	
	return webSocket;
}

function handleNewJSON(mostRecent, options) {
	if (!handleNewJSON.progress) {
		handleNewJSON.progress = {};
	}
	
	$("#progress_" + mostRecent.uuid).show();
	var rate = "";
	if (parseFloat(mostRecent.kbPerSecond) >= 1000) {
		rate = "(" + (parseFloat(mostRecent.kbPerSecond) / 1024).toFixed(2) + " MBps)";
	} else if (parseFloat(mostRecent.kbPerSecond) > 0) {
		rate = "(" + parseFloat(mostRecent.kbPerSecond).toFixed(0) + " KBps)";
	}
	
	var message = "";
	var img = "videostatus_complete.png";
	if (mostRecent.status == "IN_PROGRESS") {
		message = "Currently encoding";
		img = "videostatus_encodingInProgress.png";
	} else if (mostRecent.status == "WAITING") {
		message = "Waiting to encode";
		img = "videostatus_waiting.png";
	} else if (mostRecent.status == "UPLOADING") {
		message = "Uploading to the cloud " + rate;
		img = "videostatus_uploading.png";
	} else if (mostRecent.status == "DOWNLOADING") {
		message = "Downloading from the cloud " + rate;
		img = "videostatus_downloading.png";
	}
	
	if (mostRecent.type == "onComplete") {
		$("#progress_" + mostRecent.uuid + " .status").html("Complete");
		$("#progress_" + mostRecent.uuid + " .progressBar").progressBar(100);
		$("#progress_" + mostRecent.uuid + " .timeRemaining").html("0:00");
		if (mostRecent.status == "UPLOADING" || mostRecent.status == "DOWNLOADING" || mostRecent.status == "COMPLETE") {
			$("#torrenticon_" + mostRecent.uuid + " img").attr("src", "/images/videostatus_complete.png");
		}
		setTimeout(function () {
			$("#progress_" + mostRecent.uuid).hide(500);
			
			if (options.onComplete) {
				options.onComplete(mostRecent);
			}
		}, 6 * 1000);
		
	}
	
	if (mostRecent.message && ((options == undefined) || !options.hideMessage)) {
		$("#progress_" + mostRecent.uuid + " .message").html(mostRecent.message);
	}
	if (mostRecent.progress) {
		$("#progress_" + mostRecent.uuid + " .status").html(message);
		$("#torrenticon_" + mostRecent.uuid + " img").attr("src", "/images/" + img);
		handleNewJSON.progress[mostRecent.id] = true;
		$("#progress_" + mostRecent.uuid + " .progressBar").progressBar(mostRecent.progress * 100);
	}
	if (mostRecent.timeRemaining) {
		$("#progress_" + mostRecent.uuid + " .timeRemaining").html(toTimeString(mostRecent.timeRemaining, 0));
	}
}


function notification(error, color) {
	$("#notification").remove();
	var notification = '<div id="notification"><table id="notificationTable" class="' + color + '">';
	notification += '<tr><td>' + error;
	notification += "</td></tr></table></div>";
	
	$('#container #header').append(
			notification
	);
}

function betterToolTip() {
	var helpTimeout = null;
	var clearHelp = function() {
		clearTimeout(helpTimeout);
		$('.helpText').remove();
	}
	
	$('.betterToolTip').hover(function(e) {
		var altText = $(this).attr('alt');
		if (altText != "" && altText != null) {
			var left = $(this).position().left;
			var top = $(this).position().top + 37;
			var item = $(this);
			helpTimeout = setTimeout(function() {
				item.parent().append("<div class='helpText' style='left:" + left + "px;top:" + top + "px;'>" + altText + "</div>");
			}, 500);
		}
	},
	clearHelp);
	
	return {
		clearHelp : clearHelp
	};
}

function BootstrapModal(linkSelector, modalSelector) {
	var initLink = $(linkSelector); 
	var el = $(modalSelector);
	var url, callback;
	
	$(document).on("click", linkSelector, function(e) {
		e.preventDefault();
		$('.modal').modal('hide');
		show();
	});
	
	el.on("focus", ".error input", function() {
		var group = $(this).parents(".error");
		group.removeClass("error");
		group.find('.help-block').remove();
	});
	
	el.on("hidden", function () {
		// Reset the state of the modal
		$(this).find(".error").removeClass("error");
		$(this).find(".help-block").remove();
		$(this).find(".control-group input").val("");
	});
	
	function setUrlAndCallback(_url, _callback) {
		url = _url;
		callback = _callback;
	}
	
	//_validation returns boolean after checking form
	function beforePost(_url, _validation, _callback){
		setUrlAndCallback(_url, _callback);
		el.find(".btn-primary").off().click(function(){
			if(_validation()){
				postModalData();
			}
		});
		
		el.find("input").keypress(function(e) {
		    if(e.which == 13) {
		    	if(_validation()){
					postModalData();
				}
		    }
		});
	}
	
	function onPost(_url, _callback) {
		setUrlAndCallback(_url, _callback);
		el.find(".btn-primary").off().click(postModalData);
		el.find("input").keypress(function(e) {
		    if(e.which == 13) {
		        postModalData();
		    }
		});
	}
	
	function postModalData() {
		var formData = {};
		el.find("input, textarea").each(function(idx, thisEl) {
			formData[$(thisEl).attr("id")] = $(thisEl).val();
		});
		$.post(url, formData, callback);
	}
	
	function hide() {
		el.modal("hide");
	}
	
	function show() {
		$(".modal").modal("hide");
		
		el.modal("show");
		el.css('margin-top', window.pageYOffset + 30);
	}
	
	function error(fieldSelector, msg) {
		addFieldError(el, fieldSelector, msg);
	}
	
	function setVal(fieldSelector, newVal) {
		el.find(fieldSelector).val(newVal);
	}
	
	return {
		onPost : onPost,
		hide : hide,
		show : show,
		error : error,
		setVal : setVal,
		setUrlAndCallback : setUrlAndCallback,
		postModalData : postModalData,
		beforePost : beforePost
	};
}

function addFieldError(el, fieldSelector, msg) {
	var group = el.find(fieldSelector).parents(".control-group")
	group.removeClass("error");
	group.find('.help-block').remove();
	
	el.find('.help-block').remove();
	el.find(fieldSelector).parents(".control-group").addClass("error");
	el.find(fieldSelector).after($("<span class='help-block'>" + msg + "</span>"))
}

function BootstrapDropdown(selector, callback) {
	var el = $(selector);
	
	el.find(".dropdownSearch").hide();
	
	$(el).on("click", ".dropdown-menu li a", function(e) {
		e.preventDefault();
		$(this).parents('.dropdown').find('.dropdown-toggle').html($(this).text() + "<span class=\"caret\"></span>");
		$(this).parents('.dropdown').find('.dropdown-toggle').data('value', $(this).data('value'));
		
		callback(el, $(this));
	});
	
	$(el).find('.dropdownSearch').click(function (e) {
		e.stopPropagation();
	});
	
	$(el).find('.dropdownWithSearch').click(function() {
		$(this).parents('.dropdown').find(".dropdownSearch").toggle();
		$(this).parents('.dropdown').find(".dropdownSearch").focus();
	});
	
	$(el).find('.dropdown-menu').on("click", "li a", function(e) {
		$(this).parents('.dropdown').find('.dropdownSearch').toggle();
	});
	
	$(el).find('.dropdownSearch').keyup(function(e) {
		if ($(this).val() == "") {
			$(this).parents(".dropdown").find(".dropdown-menu li").removeClass("hidden");
		} else {
			$(this).parents(".dropdown").find(".dropdown-menu li:Contains('" + $(this).val() + "')").removeClass("hidden");
			$(this).parents(".dropdown").find(".dropdown-menu li:not(:Contains('" + $(this).val() + "'))").addClass("hidden");
		}
	});
	
	function clear() {
		el.find('.dropdown-menu').html('');
	}
	
	function remove(removeValue) {
		el.find('.dropdown-menu li a[data-value="' + removeValue + '"]').parent().remove();
		if (value() == removeValue) {
			setValue(el.find('.dropdown-menu li:first a').data("value"));
		}
	}
	
	function add(text, value) {
		if (!value) {
			value = text;
		}
		el.find('.dropdown-menu').append("<li><a data-value='" + value + "' href='#'>" + text + "</a></li>");
	}
	
	function value() {
		return el.find('.dropdown-toggle').data('value');
	}
	
	function setValue(value) {
		var item = el.find('.dropdown-menu li a[data-value="' + value + '"]');
		if (item) {
			$(el).find('.dropdown-toggle').html(item.text() + '<span class="caret"></span>');
			$(el).find('.dropdown-toggle').data('value', value);
		}
	}
	
	function forceSelection(text, value) {
		$(el).find('.dropdown-toggle').html(text + '<span class="caret"></span>');
		$(el).find('.dropdown-toggle').data('value', value);
	}
	
	function makeScrollable(height) {
		el.find('.dropdown-menu').height(height);
		el.find('.dropdown-menu').css('overflow-y', 'auto');
	}
	
	function count() {
		return el.find(".dropdown-menu li").length;
	}
	
	return {
		clear : clear,
		add : add,
		value : value,
		setValue : setValue,
		makeScrollable : makeScrollable,
		forceSelection : forceSelection,
		remove : remove,
		count : count
	};
}

var what_ie_version = (function(){

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;

}());

function LiveSearchText(el, results_selector, postUrl, submitFn, nameVar, afterResults) {
	var currentTimeout = null;
	var searchVal = null;
	var afterResults = afterResults;
	
	el.keyup(function(e) {
		searchVal = el.val();
		switch (e.which) {
		case 38:
			e.preventDefault();
			$(results_selector + " .selected").each(function (e) {
				$(this).removeClass("selected").prev().addClass("selected");
			});
			break;
		case 40:
			e.preventDefault();
			$(results_selector + " .selected").each(function (e) {
				$(this).removeClass("selected").next().addClass("selected");
			});
			break;
		case 27:
			e.stopPropagation();
			$(results_selector).hide();
			break;
		case 13:
			submitFn(searchVal);
			break;
		case 9:
			submitFn(searchVal);
			break;
		default:
			window.clearTimeout(currentTimeout);
			if ($.trim(el.val()) == "") {
				$(results_selector).hide();
				el.parents(".controls").find(".loading_indicator").remove();
				afterResults([], true);
			} else {
				$(results_selector).show();
				if(!el.parents(".controls").children(".loading_indicator").length > 0) {
					el.parents(".controls").append($("<div class='loading_indicator'><img src='/images/ajax-loader-small.gif' /></div>"));
				}
				currentTimeout = setTimeout(function() {
					$.post(postUrl, { action : "search", query : searchVal }, function(data) {
						el.parents(".controls").find(".loading_indicator").remove();
						var json = $.parseJSON(data);
						var directMatchFound = false;
						$(results_selector).show();
						$(results_selector + " ul").html("");
						for (var i in json.results) {
							var selected = "";
							if (i == 0) {
								selected = " class='selected'";
							}
							$(results_selector + " ul").append($("<li" + selected + " data-id='" + json.results[i].id + "'>" + json.results[i][nameVar] + "</li>"));
							if (json.results[i][nameVar] == searchVal) {
								directMatchFound = true;
							}
						}
						
						afterResults(json.results, directMatchFound);
					});
				}, 200);
			}
		}
		
	});
}

$(function () {
	
	$('.tab_interface').each(function() {
		if ($(this).attr('id') != undefined && $(this).attr('id') != "") {
			var cookieValue = $.cookie($(this).attr('id') + "_tab");
			if (cookieValue != undefined && cookieValue != "") {
				$('.tab').removeClass('active');
				$('#' + cookieValue).addClass('active');
			}
		}
	});

	$('.tab_interface .tabbody').hide();
	$('.tab_interface .active').each(function() {
		$('.' + $(this).attr('id')).show();
	})
	$('.tab').click(function() {
		$('.tab').removeClass('active');
		$('.tabbody').hide();
		$(this).addClass('active');
		$('.' + $(this).attr('id')).show();
		var ti_parent = $(this).parents('.tab_interface:first');
		if (ti_parent.attr('id') != undefined && ti_parent.attr('id') != "") { 
			$.cookie(ti_parent.attr('id') + "_tab", $(this).attr('id'));
		}
	});
	
	betterToolTipController = new betterToolTip();
	
});