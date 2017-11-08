/*
 * Add a ":Contains" pseudo-selector that is case insensitive, unlike ":contains"
 */
jQuery.expr[":"].Contains = jQuery.expr.createPseudo(function(arg) {
    return function( elem ) {
        return jQuery(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
    };
});

$(document).ready(function(){
    $('.js-watermark').each(function(){
       var wm = $(this).attr('rel');
        $(this).watermark(wm);
    });

    $('.js-add-address').click(function(){        
        $('.js-address-box').slideToggle(500);        
        return false;
    });

    $('.js-more-email').click(function(){
        $('.email_input').slideDown(500);
        return false;
    });
//     $('.reply-popover').popover({
//        html:true,
//        animation: true,
//        placement:'top',
//        trigger:'click'
//    });
    var overPopup = false;

    $('.reply-popover').popover({
        html:true,
        animation: true,
        placement:'top',
        trigger:'manual',
        delay: { show: 350, hide: 100 }
    });

    var timer, popover_parent;
    function hidePopover(elem) {
        $(elem).popover('hide');
    }

    $('.reply-popover').hover( function() {
        var self = this;
        clearTimeout(timer);
        $('.popover').hide(); //Hide any open popovers on other elements.
        popover_parent = self
        $(self).popover('show');
    },
    function() {
        var self = this;
        timer = setTimeout(function(){hidePopover(self)},300);
    });

    $(document).on({
        mouseover: function() {
            clearTimeout(timer);
        },
        mouseleave: function() {
            var self = this;
            timer = setTimeout(function(){hidePopover(popover_parent)},300);
        }
    }, '.popover');


    $('.js-show-set').click(function(){
        $('.score-board').slideToggle(500);
        var text = $(this).text();        
        var label = text.match('Show');
        if(label == 'Show'){
            $(this).text('+ Hide Set');    
        }
        else {
            $(this).text('+ Show Set');
        }
        
        return false;
    });

    $('.admin_link_set').click(function(){        
        $(this).next(".admin_sidebar_inner").slideToggle();
        var parent = $(this).parent("li");        
        if(parent.attr("class") == "active") {
            parent.removeClass("active");
        }
        else {
            parent.addClass("active");
        }
        return false;
    });

    //check checkbox if children checkbox is clicked
    $('.msg_recipient_list input[type="checkbox"]').mousedown(function(ev) {
        ev.stopPropagation();
        if (!$(this).is(':checked')) {
            $(this).parent().addClass("checked");
        }
        else {
            $(this).parent().removeClass("checked");        
        }
    });

    //check checkbox if parent li is clicked
    $('.js-checkbox-check').mousedown(function() {
        if ($(this).children('input[type="checkbox"]').prop("checked")) {
            $(this).children('input[type="checkbox"]').removeProp("checked");
            $(this).removeClass("checked");
        }
        else {
            $(this).children('input[type="checkbox"]').prop("checked",true);
            $(this).addClass("checked");
        }
    });

    $('.reply-popover').hover (function(){
        $(this).next('.popover').css({"top": "auto","left": "auto","right": "0px","bottom": "30px"});
    });

    $(document).on('click.modal', '[data-toggle="modal"]', function(){
        var elem = $(this).attr('href');        
        var screenTop = $(document).scrollTop();    
        var windowWidth = document.documentElement.clientWidth;    
        var windowHeight = document.documentElement.clientHeight;
        var popupHeight = $(".modal").height();
        var popupWidth = $(".modal").width();
        var topOffset = windowHeight / 2 - popupHeight / 2;
        if(topOffset < 0) {
            topOffset = 50;
        }
        $(".modal").css("position","absolute");
        $(".modal").css("left","50%");
        $(".modal").css("top", screenTop + topOffset);
        $(".modal").css("margin-left", -(popupWidth / 2));
    });
    $('.js-comment_count > p > .js-show_comment').click(function(){
        $(this).children('.arrow').toggleClass('up');
        $(this).parents('.thumbnail').next('.comments_wrap').slideToggle();
        $(this).toggleClass("active active_comment");
        return false;
    });
    $('.js-comment_count > p > .js-show_score').click(function(){
        $(this).parents('.thumbnail').find('.js-score_board').slideToggle();
        $(this).toggleClass("active");
        var value_rel = $(this).attr('rel');
        var value_html = $(this).html();
        $(this).attr('rel', value_html);
        $(this).html(value_rel);
        return false;
    });
    $('.js-score_board > ul > li >a').click(function() {
        $('.js-score_board > ul > li >a').removeClass('active');
        $(this).addClass('active');
    });
    $('.js-score-carosel').carouFredSel({
        auto : false,
        prev : ".prev_arrow",
        next : ".next_arrow"
    });
    $('.js-network_sidebar li > a').click(function(){
        $(this).next('ul').slideToggle();
        $(this).toggleClass('active');
        return false;
    });
    $('.js-open').click(function (){
        $(this).hide('slow').next().show("slow");
         return false;
    });
    $('.js-close').click(function (){
        $(this).parent('.link_tabs').hide('slow');
        $('.js-open').show();
         return false;
    });
    $('.js-dropdown_btn').click(function(){
        $('.user_details_wrap').slideToggle();
        $(this).toggleClass('open');
        return false;
    });
    $('.js-show-event').on('click',function () {
        $(this).toggleClass('up').parent().next().slideToggle();
        return false;
    });
    $('#create_report_event_list').on('click','.first_level,.second_level,input[type="checkbox"]',function (event) {
    	if($(this).attr('type') == 'checkbox'){
    		event.stopPropagation();
    	}
    	else{
    		console.log($(this).attr('type'));
    		$(this).find(".caret").toggleClass('up')
            $(this).children('.second_level,.third_level').slideToggle();
            return false;
    	}
    });
    $('.js-edit_folder_name').click(function(){
        var parent_li = $(this).closest('li');
        $(parent_li).addClass('edit_fldr_nam');
        $(parent_li).children('input').show();
        $(parent_li).children('a').hide();
        $(this).hide();
        return false;
    });
    $(".nav_sidebar_primary").on("click", ".js-add_new_folder", function(){
        var parent_ul = $(this);
        var parent_li = $('.js-add_new_folder').closest('li');
        $(parent_li).after('<li class="edit_fldr_nam"><input type="text" placeholder="A New Folder Name"/><span class="edit_fav"><a href="#"><span class="icon_trash"></span></a></span></li><li class="divider"></li><li><a href="#" class="js-add_new_folder"><span class="icon_add"></span>Add Folder</a></li>');
        $(parent_li).remove();
        //$(parent_ul).children('li').addClass('disable');
        return false;
    });
    $(".linkable").on("click", function(e) {
    	location.href=$(this).data("link");
    });
     $('.js-video-popover').hover (function(){
        $(this).next('.popover').css({"left": "-20px" ,"bottom": "57px"});
    });

    $('.recipient_head > label').click(function(){
        $("#appendedPrependedInput").focus();        
    });

    $('.dropdown-submenu').hover(function() {
        $(this).find('.dropdown-menu').stop(true, true).show();
        $(this).addClass('open');
        }, function() {
           $(this).find('.dropdown-menu').stop(true, true).hide();
           $(this).removeClass('open');
    });

    $('.random_bar').tooltip({
        trigger:"click"
    });

    $('.js-dropdown-filter > li > a').click(function(){
        $(this).parents('.js-dropdown-filter').prev('a').html($(this).html()+'<span class="caret"></span>');
        $(this).parents('.js-dropdown-filter').parents('.dropdown').removeClass('open');
        return false;
    });
    $('.js-new-statreel').click(function() {
        $('.js-statreels-toggle').slideToggle();
    })
});