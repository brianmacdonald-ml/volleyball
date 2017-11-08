(function($) {
	$.fn.autocomplete = function(data, id, itemType, searchFields, exactMatchField) {
		var self = this;
		$(this).find('.acInput').keyup(function(e) {
			filterOpponents(e, self, data);
		});
		
		$(this).find('.acInput').keydown(function(e) {
			navigateTeams(e, self, data);
		})
		
		$(this).find('.acInput').blur(function(e) {
			$.validationEngine.closePrompt('.acInput');
		})
		
		$(this).find('tr').live("click", function() {
			$(this).find("input").prop("checked", true);
			$(self).find('.acInput').val($.trim($(this).find("td").text()));
		});
		
		// If the selector box somehow gets the focus, move to the next input automatically.
		$(this).find('.acSelector').focus(function(e) {
			var elements = $(this).closest('form').find('input, button').not("[type=radio], #addPlayer").filter(":visible");
			var targetIndex = elements.index($('.acInput')) + 1;
			
			// If the element we're coming from isn't .acInput, we're moving backwards and should go to the previous input
			// Note: explicitOriginalTarget is only supported by FF, but this isn't an issue in Chrome because the div never gets focus
			if (e.originalEvent && e.originalEvent.explicitOriginalTarget) {
				if (!$(e.originalEvent.explicitOriginalTarget).hasClass('acInput')) {
					targetIndex--;
				}
			}
			elements[targetIndex].focus();
		});
		
		/*
		 * Handle up and down arrow.
		 */
		navigateTeams = function(e, self, data) {
			if (e.which != 38 && e.which != 40) {
				return;
			}
			
			e.preventDefault();
			e.stopPropagation();
			
			var typedSoFar = self.find('.acInput').val();
			if (self.find('.acInput').get(0).selectionStart != self.find('.acInput').get(0).selectionEnd) {
				typedSoFar = typedSoFar.substr(0, self.find('.acInput').get(0).selectionStart);
			}
			
			var checkedIndex = -1;
			var currentIndex = 0;
			var allVisible = [];
			
			// Get the checked row
			var current = self.find('.acSelector input:checked').parents("tr");
			
			// Get the next or previous row based on key pressed
			var new_row;
			if (current.length > 0) {
				if (e.which == 38) {
					new_row = current.prevAll().filter("tr:visible").first();
				} else {
					new_row = current.nextAll().filter("tr:visible").first();
				}
			} else {
				// Nothing was selected yet - grab the first one
				new_row = self.find('.acSelector input:visible').first().parents("tr").first();
			}
			
			//If no rows available or we're at the top or bottom, do nothing. 
			if (new_row.length > 0) {
				var next = new_row.find('input');
				next.prop("checked", true);
				selectItem.apply(next, [self, typedSoFar]);
			}
		}
		
		/*
		 * Check an item's radio button and add its value to the textbox.
		 */
		selectItem = function(self, typedSoFar) {
			var inputBox = self.find('.acInput');
			var selectedValue = $(this).val();
			
			inputBox.val(selectedValue);
			inputBox.get(0).selectionStart = typedSoFar.length;
			inputBox.get(0).selectionEnd = selectedValue.length;
			
			updateStatus(self, true, inputBox.val(), itemType);
		}
		
		/*
		 * Hide non-matching items as user types in input box. 
		 */
		filterOpponents = function(e, self, data) {
			if (e.which == 38 || e.which == 40) {
				return;
			}
			
			self.find('.acSelector input:checked').removeAttr('checked');
			var inputBox = self.find('.acInput');
			var typedSoFar = inputBox.val();
			
			if (typedSoFar == "") {
				self.find(".acSelector tr").attr("style", "");
				$.validationEngine.closePrompt('.acInput');
				return;
			}
			
			var exactMatch = false;
			for (var i in data) {
				var item = data[i];
				var eventObj = self.find("tr#" + id + "row_" + item.id);
				if (match(item, typedSoFar, searchFields)) {
					if (matchExactly(item, typedSoFar, exactMatchField)) {
						exactMatch = true;
						self.find("#" + id + "radio_" + item.id).prop('checked', true);
					}
					eventObj.css("display", "");
				} else {
					eventObj.css("display", "none");
				}
			}
			
			updateStatus(self, exactMatch, typedSoFar, itemType);
		}
		
		/*
		 * Check for an approximate match and keep item visible in box if so.
		 */
		match = function(item, typed, fields) {
			for (var i in fields) {
				var field = fields[i];
				var checkText = item[field];
				if (checkText == undefined) {
					checkText = "";
				}
				if ($.trim(checkText).toLowerCase().indexOf($.trim(typed).toLowerCase()) == 0) {
					return true;
				}
			}
			
			return false;
		}
		
		/*
		 * Check for an exact match and select the appropriate item if so.
		 */
		matchExactly = function(item, typed, field) {
			var checkText = item[field];
			if (checkText == undefined) {
				checkText = "";
			}
			if ($.trim(checkText).toLowerCase() == $.trim(typed).toLowerCase()) {
				return true;
			}
			
			return false;
		}
		
		/*
		 * Update the status bubble for the field.
		 */
		updateStatus = function(self, exactMatch, typedSoFar, itemType) {
			// This is how the validationEngine code checks to see if the prompt already exists
			var linkToField = $.validationEngine.linkTofield(self.find('.acInput'));
			var alreadyExists = !!($("." + linkToField)[0]);
			var statusMessage = exactMatch ? "Using an existing " + itemType + " named " + typedSoFar : "Creating a new " + itemType + " named " + typedSoFar;
			var statusType = exactMatch ? "pass" : "load";
			if (alreadyExists) {
				$.validationEngine.updatePromptText(self.find('.acInput'), statusMessage, statusType);
			} else {
				$.validationEngine.buildPrompt(self.find('.acInput'), statusMessage, statusType);
			}
		}
		
		this.addData = function(data_item) {
			data.push(data_item);
		}
		
		this.blankError = function() {
			var msg = "This field can't be blank";
			var linkToField = $.validationEngine.linkTofield(self.find('.acInput'));
			var alreadyExists = !!($("." + linkToField)[0]);
			if (alreadyExists) {
				$.validationEngine.updatePromptText(self.find('.acInput'), msg, "error");
			} else {
				$.validationEngine.buildPrompt(self.find('.acInput'), msg, "error");
			}
		}
		
		return this;
	}
})( jQuery );