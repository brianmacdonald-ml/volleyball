
function ObjectSelector(headers, values, settings) {
	var style = settings.style ? settings.style : "checkbox";
	var title = settings.title ? settings.title : style == "checkbox" ? "Choose some": "Choose one";
	var divId = settings.id ? settings.id : "object";
	var selectFunction = settings.selectFunction ? settings.selectFunction : function () {};
	var buttonText = settings.buttonText ? settings.buttonText : "Use these";
	var initiallyChecked = settings.initiallyChecked != undefined ? settings.initiallyChecked : false;
	
	var divObj = undefined;
	
	init();
	
	function draw() {
		var html = "<div style='display:none;padding: 10px;' id='" + divId + "SelectDialog' title='" + title + "'>\
			<div class='search'>\
				<span class='sbox_left'></span>\
				<span class='sbox'>\
					<input type='text' class='lightText'/>\
				</span>\
				<span class='sbox_right search_clear'></span>\
			</div>\
			<div style='border: 1px solid #999;clear:both;'>\
			<table style='width:100%;' class='headers striped tight'>\
			  <tr>";
		
		for (var i in headers) {
			var header = headers[i];
			if ((Number(i) == 0) && (style == "checkbox")) {
				html += "<th style='text-align:left'><input id='selectAll' type='checkbox' " + (initiallyChecked ? "checked='checked'" : "") + "/>" + header + "</th>"
			} else {
				html += "<th>" + header + "</th>";
			}
		}
		html += "</tr>";
		
		var checked = ((style == "checkbox") && (initiallyChecked)) ? "checked='checked'" : "";
		for (var i in values) {
			var value = values[i];
			var id = value[0];
			html += "<tr id='" + divId + id + "'>";
			html += "<td style='width:5%'><input type='" + style + "' class='checkMeOut' " + checked + "name='" + divId + "Selector' value='" + id + "'/></td>";
			for (var j = 1; j < value.length; j++) {
				html += "<td><label>" + value[j] + "</label></td>";
			}
			html += "</tr>";
		}
		
		html += "</table>\
				</div>\
			</div>";
	
		return html;
	}
	
	function init() {
		if (divObj == undefined) {
			divObj = $("body").append(draw());
			$("#" + divId + "SelectDialog .search input").keyup(filterPlayers(divId));
			$("#" + divId + "SelectDialog .search .search_clear").click(clearSearchNow(divId));
			$("#" + divId + "SelectDialog #selectAll").click(selectAll(divId));
		}
	}
	
	function show(selectFunction) {
		init();
		
		if (show.dialog == undefined) {
			var buttons = {
				"Cancel": function() { closeAndReset(this); }
			};
			buttons[buttonText] = function() { selectFunction(); closeAndReset(this); };
			
			show.dialog = $("#" + divId + "SelectDialog").dialog({ 
				closeText: '',
				modal: 'true',
			    height: '350',
			    width: '450',
				buttons: buttons
			});
		} else {
			show.dialog.dialog("open");
		}

		$("#" + divId + "SelectDialog .search input").focus();
	}
	this.show = show;
	
	function closeAndReset(dialogObj) {
		$("#" + divId + "SelectDialog .search input").val("");
		$("#" + divId + "SelectDialog .search input").keyup();
		$(dialogObj).dialog("close");
	}
	
	function selectAll(divId) {
		return function () {
			var checked = $("#" + divId + "SelectDialog #selectAll").attr("checked");
			if (!checked) {
				$("#" + divId + "SelectDialog .checkMeOut").removeAttr("checked");
			} else {
				$("#" + divId + "SelectDialog .checkMeOut").attr("checked", checked);
			}
		}
	}
	
	function clearSearchNow(divId) {
		return function () {
			$("#" + divId + "SelectDialog .search input").val("");
			$("#" + divId + "SelectDialog .search input").keyup();
		}
	}

	function filterPlayers(divId) {
		return function () {
			var value = $(this).val();
			
			if (value == "") {
				$("#" + divId + "SelectDialog tr").attr("style", "");
				return;
			}
			
			value = value.toLowerCase();
			var matchingEvents = 0;
			var lastMatch = undefined;
			for (var i in values) {
				var objValue = values[i];
				var objId = objValue[0];
				
				// Here we're using the document.getElementById instead of jQuery 
				// because I found it affected performance of the video playback when searching.
				var eventObj = document.getElementById(divId + objId);
				
				var name = "";
				for (var j = 1; j < objValue.length; j++) {
					name += objValue[j] + " ";
				}
				name = name.toLowerCase();
				
				var className;
				if (name.indexOf(value) != -1) {
					// Matches
					className = "";
					matchingEvents++;
					lastMatch = eventObj;
				} else {
					// Non-matches
					className = "display:none";
				}
				eventObj.setAttribute("style", className);
			}
			
			if (matchingEvents == 1) {
				$(".checkMeOut", lastMatch).attr("checked", true);
			}
		}
	}
	
	function setSelected(selectedIds) {
		$("#" + divId + "SelectDialog .checkMeOut").removeAttr("checked");
		$("#" + divId + "SelectDialog #selectAll").removeAttr("checked");
		for (var i in selectedIds) {
			var objId = selectedIds[i];
			$("#" + divId + objId + " .checkMeOut").attr("checked", true);
		}
	}
	this.setSelected = setSelected;
	
	function isAllSelected() {
		var allSelected = true;
		$("#" + divId + "SelectDialog .checkMeOut").each(function () {
			allSelected = allSelected && $(this).attr("checked");
		});
		
		return allSelected;
	}
	this.isAllSelected = isAllSelected;
	
	function result() {
		var selectedIds = [];
		$("#" + divId + "SelectDialog .checkMeOut").each(function () {
			var checked = $(this).attr("checked");
			var id = $(this).attr("value");
			if (checked) {
				selectedIds.push(id);
			}
		});
		
		return selectedIds;
	}
	this.result = result;
	
	function reset() {
		$("#" + divId + "SelectDialog .checkMeOut").removeAttr("checked");
	}
	this.reset = reset;
}