<%@ page session="false"%>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<script type="text/javascript" src="/js/common.js"></script>

<script type="text/javascript">
$(function () {
	$(".shareBox").click(function () {
		$('#shareType').val($(this).attr('id'));
		$('#shareForm').submit();
	});
});
</script>

<div id="content"><div id="innercontent"><div class="middle">

<h2>Sharing '${targetGrouping.name}' to the cloud...</h2>

<div class="tab_interface">

	<div id="a" class="tab active">SHARE</div>
	<div id="b" class="tab last">SPECIFIC USER SHARE</div>
	<div class="clear"></div>
	
	<div class="tabbody a">
		<form method="post" id="shareForm">
			<h3>Who would you like to share this ${targetGrouping.myType.name} with?</h3>
			
			<div class="shareBox" id="scouting">
				<div class="shareOption">
				MY TEAM
				</div>
				<div class="shareOptionCaption">
				only share this ${targetGrouping.myType.name} with your coaching staff and players
				</div>
			</div>

			<div class="shareBox" id="regular">
				<div class="shareOption">
				OTHER FOLLOWERS
				</div>
				<div class="shareOptionCaption">
				share this ${targetGrouping.myType.name} with everyone who is following your season
				</div>
			</div>
			
			<div class="clear"></div>
			<input type="hidden" name="selection" value="group"/>
			<input type="hidden" name="shareType" id="shareType" />
		
		</form>
	</div>
	
	<div class="tabbody b">
		<form method="post">
			<h3 style="margin-bottom:0">Who would you like to share this ${targetGrouping.myType.name} with?</h3>
			<span class="tinyHelpText">Enter their email addresses separated by spaces and we'll let them know they have new content!</span>
			
			<br/>
			<br/>
			
			<input type="text" name="names" size="140"/>
			
			<br/>
			<br/>
			
			<input type="hidden" name="selection" value="users"/>
			
			<input class="hoverGreen" type="submit" name="Submit" value="Share this ${targetGrouping.myType.name}"/>
			<input class="hoverRed" type="submit" name="cancel" value="Cancel"/>
		</form>
	</div>
	
</div>

</div></div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>