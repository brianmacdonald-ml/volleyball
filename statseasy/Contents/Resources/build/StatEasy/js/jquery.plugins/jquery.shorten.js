(function($) {
	jQuery.fn.shorten = function() {
		this.each(function() {
			var full = $(this).html();
			var size = $(this).data("size") || 30;
			var shortened = full.substr(0, size);
			if (shortened != full) {
				$(this).html(shortened + "...");
				$(this).attr("title", full);
			}
		});
	}
})(jQuery);