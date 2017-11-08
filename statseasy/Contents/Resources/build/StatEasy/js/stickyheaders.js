// Sticky header widget
// based on this awesome article:
// http://css-tricks.com/13465-persistent-headers/
// **************************

/*
 *  Custom method for determining real width - every other method, including
 *  jQuery's width() would round the width. Have to use getBoundingClientRect
 *  and account for padding and borders.
 */
(function($) {
	var getActualWidth = function(jqEl) {
		var el = jqEl[0];
		var bounding = el.getBoundingClientRect().width;
		var leftPaddingCss = jqEl.css('padding-left');
		var rightPaddingCss = jqEl.css('padding-right');
		
		var leftPaddingNum = parseInt(leftPaddingCss.substring(0, leftPaddingCss.length-2));
		var rightPaddingNum = parseInt(rightPaddingCss.substring(0, rightPaddingCss.length-2));
		
		var borderLeftCss = jqEl.css('border-left-width');
		var borderRightCss = jqEl.css('border-right-width');
		
		var borderLeftNum = parseInt(borderLeftCss.substring(0, borderLeftCss.length-2));
		var borderRightNum = parseInt(borderRightCss.substring(0, borderRightCss.length-2));

		return bounding - (leftPaddingNum + rightPaddingNum + borderLeftNum + borderRightNum);
	}
	
	$.fn.stickyHeaders = function() {
		$(this).each(function() {
			var table = $(this);
			if ($(table).find('.stickyHeader').length) { return; }
		    var totalHeight = 0;
		    var win = $(window),
		      header = $(table).find('thead'),
		      hdrCells = header.find('tr').children(),
		      sticky = header.find('tr').clone()
		        .addClass('stickyHeader')
		        .css({
		          width      : header.width(),
		          position   : 'fixed',
		          top        : 0,
		          visibility : 'hidden'
		        }),
		      stkyCells = sticky.children();
		    // update sticky header class names to match real header
		    $(table).bind('sortEnd', function(e,t){
		      var th = $(t).find('thead tr'),
		        sh = th.filter('.stickyHeader').children();
		      th.filter(':not(.stickyHeader)').children().each(function(i){
		        sh.eq(i).attr('class', $(this).attr('class'));
		      });
		    });
		    // set sticky header cell width and link clicks to real header
		    hdrCells.each(function(i){
		      var t = $(this),
		      s = stkyCells.eq(i)
		      // set cell widths
		      .width( getActualWidth(t) )
		      // clicking on sticky will trigger sort
		      .bind('click', function(e){
		        t.trigger(e);
		      })
		      // prevent sticky header text selection
		      .bind('mousedown', function(){
		        this.onselectstart = function(){ return false; };
		        return false;
		      });
		    });
		    header.prepend( sticky );
		    
		    header.find('.stickyHeader').each(function(i) {
		    	// To keep the alternating colors in the table correct, we need to manually set the background colors
		    	// of the sticky headers to match the rows they cloned
		    	var original = header.find('tr').not('.stickyHeader').eq(i);
		    	$(this).find('th').css('background-color', original.css('background-color'));
		    	
		    	// Keep track of the total height of all sticky headers so we can correctly set top position values
		    	$(this).css('top', totalHeight);
		    	totalHeight += $(this).height();
		    	
		    })
		    
		    // make it sticky!
		    win.scroll(function(){
		      var $t = $(table),
		        offset = $t.offset(),
		        sTop = win.scrollTop(),
		        sticky = $t.find('.stickyHeader'),
		        vis = ((sTop > offset.top) && (sTop < offset.top + $t.height())) ? 'visible' : 'hidden';
		      sticky.css('visibility', vis);
		    });
	
		    // Adjust the offset of the headers if the user scrolls left or right    
		    var leftInit = $(table).find('.stickyHeader').position().left;
		    var leftPos = leftInit - $(window).scrollLeft();
		    $(window).scroll(function(event) {
		    	$(table).find('.stickyHeader').offset({
		    		left : leftPos
		    	});
		    });
		});
	    
	    return this;
	}
})( jQuery );
