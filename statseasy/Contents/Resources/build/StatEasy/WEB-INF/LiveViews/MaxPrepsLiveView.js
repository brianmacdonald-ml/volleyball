/*
 * Required for all LiveViews
 */
var classname = "MaxPrepsLiveView";
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

inc("/js/FileSaver.js");

/*
 *  Everyone should hold onto their div.  It's your workpad to show off your
 *  view to the world!
 */ 
function MaxPrepsLiveView(myTargetDivId, dataManager) {
	var self = this;

	self.targetDivId = myTargetDivId;
	
	self.shown = false;
	self.valid = false;

	var currentlySelectedGroupingId;
	var currentlySelectedGroupingName;
	
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
	
	/* 
	 * This is to actually do any required long running tasks.  This is when 
	 * we're going to be shown.
	 */ 
	function show() {
		if (self.shown && self.valid) {
			return;
		}
		
		if (!self.shown) {
			var myDiv = $("#" + self.targetDivId);
		
			var innerHtml = "<div class='viewList'>Generate MaxPreps report for <select id='groupingId'>";
			var someGrouping = dataManager.groupings[dataManager.game.associatedEvent];
			currentlySelectedGroupingId = someGrouping.id;
			currentlySelectedGroupingName = someGrouping.name;
			while (someGrouping != undefined) {
				innerHtml += "<option value='" + someGrouping.id + "'>" + someGrouping.name + "</option>";
				someGrouping = dataManager.groupings[someGrouping.parentGroup];
			}
			innerHtml += "</select></div><div class='content' style='display:none'></div><pre class='toSubmit'></pre><input type='button' class='saveMe' value='Save As...'/>";
			
			myDiv.html(innerHtml);
			
			$("#" + self.targetDivId + " .saveMe").click(function () {
				var textContent = $("#" + self.targetDivId + " .toSubmit").text();
				textContent = "833973a5-2a74-4c4c-8c70-addbd633fb2d\n" + textContent;
				var blob = new Blob([textContent], {type: "text/plain;charset=utf-8"});
				
				var fileName = currentlySelectedGroupingName.replace(/[^\d.A-Za-z]/g, "");
				
				saveAs(blob, fileName + ".StatEasy.txt");
			});
			
			$("#" + self.targetDivId + " #groupingId").change(function () {
				currentlySelectedGroupingId = $(this).val();
				currentlySelectedGroupingName = $(this).find(":selected").text();
				self.valid = false;
				show();
			});
		}
		
		if (dataManager.allViews.length > 0) {
			var urlVariables = {
				viewByName: "MaxPreps",
				sportId: dataManager.sportId,
				egId: currentlySelectedGroupingId,
				format: 'ajax'
			};
			
			$.get(
				dataManager.viewUrl, 
				urlVariables,
				function (data, textStatus) {
					$('#' + myTargetDivId + ' .content').html("");
					$('#' + myTargetDivId + ' .toSubmit').html("");
					var resultingContent = "";
					
					var resultingData = $(data);
					var table;
					for (var i = 0; i < resultingData.length; i++) {
						if ($(resultingData[i]).hasClass("statTable")) {
							table = resultingData[i];
							break;
						}
					}
					
					var tHeadRows = table.tHead.rows;
					resultingContent += pullTextFromRows(tHeadRows);
					
					var tBodyRows = table.tBodies[0].rows;
					resultingContent += pullTextFromRows(tBodyRows);
					
					$('#' + myTargetDivId + ' .toSubmit').append(resultingContent);
					$('#' + myTargetDivId + ' .content').append(data);
				}
			).fail(function () {
				$('#' + myTargetDivId + ' .toSubmit').append("No MaxPreps report defined for this sport");
			});
		}
		
		self.shown = true;
		self.valid = true;
	}
	this.show = show;
	
	function pullTextFromRows(rows) {
		var resultingContent = "";
		
		for (var i = 0; i < rows.length; i++) {
			var row = rows[i];
			var $row = $(row);
			if (!$row.hasClass("stickyHeader") && !$row.hasClass("columnGroup")) {
				for (var j = 1; j < row.cells.length; j++) {
					if (j > 1) {
						resultingContent += "|";
					}
					var trimmedContent = $.trim(row.cells[j].textContent);
					if (trimmedContent == "#") {
						trimmedContent = "Jersey";
					}
					resultingContent += trimmedContent;
				}
				resultingContent += "\n";
			}
		}
		
		return resultingContent;
	}
	
	/*
	 * If we kicked off any background processes, now would be the time to stop 
	 * them since we're about to go away.
	 */
	function stopShowing() {
	}
	this.stopShowing = stopShowing;
}
