<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn"		uri="http://java.sun.com/jsp/jstl/functions" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css?sv=${serverVersion}" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js?sv=${serverVersion}" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/encoder.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/common.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/seasonDisplay.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/objectSelector.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/seasonManagement.js?sv=${serverVersion}"></script>

<div id="content"><div id="innercontent">
<div class="middle">

<script type="text/javascript">
var eventGroupings = ${json};
var allPlayers = ${playersInJson};
</script>

<form method="get" action="/reports.htm" id="reportForm">
<h2 class="titleBorder smaller">
	With the selected games, view the stats using 
	<select name="viewId">
	  <c:forEach items="${allViews}" var="view">
	  	<c:set var="checkedStatus" value=""/>
	  	<c:if test="${view.defaultView}">
	  	  <c:set var="checkedStatus" value="selected"/>
	  	</c:if>
		<option value="${view.id}-${view.type}" ${checkedStatus}>${view.name}</option>
	  </c:forEach>
	</select>
	focused on
	<select name="grouping">
	  <c:forEach items="${allGroupings}" var="grouping">
	  	<c:set var="selected" value=""/>
	  	<c:if test="${grouping.defaultGrouping}">
	  	  <c:set var="selected" value="selected='true'"/>
	  	</c:if>
		<option value="${grouping.id}" ${selected}>${grouping.name}</option>
	  </c:forEach>
	</select>
	using <a id="setPlayerDialogLink" href="#">All Players</a> 
	<input type="hidden" name="season" value="${season.id}"/>
	<input class="hoverGreen" type="submit" value="Go"/>
</h2>

<h2 class="titleBorder borderAbove">${season.team.teamName} - ${season.name}:</h2>

<div id="seasonEvents">

<c:if test="${relevantFollower.admin and fn:length(topLevelGroupings) > 15}">
	<p>Create a new 
	<c:forEach items="${topLevelTypes}" var="groupingType" varStatus="incr">
		${not incr.last and fn:length(topLevelTypes) > 1 ? '' : 'or ' } <a href="/eventSetup.htm?season=${season.id}&seriesId=${groupingType.parentSeries.id}">${groupingType.name}</a>${not incr.last ? ', ' : '' }
	</c:forEach>
	</p>
</c:if>

<table class="striped forNow" style="width:100%">
	<thead>
	<tr>
		<th><img id='open_close_all' class='open_close' src='/images/minus.png'/><input type="checkbox" name="selectAllEvents" id="selectAllEvents"/><span style="margin-left: 10px">Name</span></th>
		<th>Actions</th>
	</tr>
	</thead>
	<tbody>
	<se:eventIter items="${topLevelGroupings}" season="${season}" timesLeft="${timesLeft}">
		<tr class="depth${depth} eventRow" id="eventId${event.id}">
			<td style="padding-left: ${10 + depth * 30}px">
				<c:if test="${not leaf}">
					<img class='open_close' src='/images/minus.png'/>
				</c:if>
				<input type="checkbox" name="egId" value="${event.id}"/>
				${event.name} 
				<span class="teamColor"><se:eventResult event="${event}" season="${season}" /></span>
				<c:set var="showShare" value="true"/>
				<c:if test="${currentUsername != event.createdBy and not empty event.createdBy}">
				 <span class="sharedBy">shared by ${event.createdBy}</span>
				 <c:set var="showShare" value="false"/>
				</c:if>
			</td>
			<td>
				<c:set var="contentDisplayed" value="false"/>
				
				<c:if test="${not empty event.allVideos}">
					<a href="/video/video.htm?action=watch&eventGroupingId=${event.id}">Watch video</a>
					<c:set var="contentDisplayed" value="true"/>
					<c:if test="${event.videoUploadPercentage < 100 && event.videoUploadPercentage > 0}">
						<c:set var="altText" value="<b>${event.createdBy}</b><br /><br />" />
						
						<c:set var="uploadingStatus" value="No current upload activity.<br /><br />" />
						<c:if test="${not empty timeLeft}">
							<c:set var="uploadingStatus">Currently uploading: ${timeLeft} left<br /><br /></c:set>
						</c:if>
						
						<c:set var="altText">${altText}${uploadingStatus}</c:set>
						
						<c:forEach items="${event.allVideos}" var="gamevideo">
							<c:forEach items="${gamevideo.segments}" var="segment">
								<c:set var="color" value="black" />
								<c:if test="${segment.currentPercentage < 100}">
									<c:set var="color" value="red" />
								</c:if>
								<c:set var="altText">${altText}<span style='color:${color};'>${segment.encodedFileName}: <b>${segment.currentPercentage}%</b></span><br /></c:set>
							</c:forEach>
						</c:forEach>
						<span class="percentUploadedSpan"><a href="#" class="percentUploaded betterToolTip" alt="${altText}">( ${event.videoUploadPercentage}% )</a></span>
					</c:if>
				</c:if>
				<c:if test="${not isServer}">
					<c:if test="${contentDisplayed}">
						|
					</c:if>
					<c:choose>
						<c:when test="${not event.myType.leafType}">
							<a href="/eventSetup.htm?season=${season.id}&eventGroupingId=${event.id}">Create a new ${event.myType.childType.name}</a>
						</c:when>
						<c:otherwise>
							<a href="/take/gameStats.htm?id=${event.associatedEvent.id}">Take stats</a>
						</c:otherwise>
					</c:choose>
					| <a href="/eventGrouping.htm?id=${event.id}">Edit properties</a>
					<c:set var="contentDisplayed" value="true"/>
				</c:if>
				<c:if test="${event.myType.index == 0 and not isServer}">
					<c:if test="${contentDisplayed}">
						|
					</c:if>
					<a href="/importExport.htm?action=export&egId=${event.id}">Export</a>
					<c:set var="contentDisplayed" value="true"/>
				</c:if>
				<c:if test="${contentDisplayed}">
					|
				</c:if>
				<c:choose>
					<c:when test="${event.shareError}">
						<c:set var="shareText" value="Reshare <span class='need'>(sync error)</span>" />
					</c:when>
					<c:when test="${event.shared}">
						<c:set var="shareText" value="Reshare" />
					</c:when>
					<c:otherwise>
						<c:set var="shareText" value="Share" />
					</c:otherwise>
				</c:choose>
				<a href="/share.htm?id=${event.id}&season=${season.id}">${shareText}</a>
				<c:set var="contentDisplayed" value="true"/>
				<c:if test="${depth == 0 and isServer and empty playerFollower}">
					<c:if test="${contentDisplayed}">
						|
					</c:if>
					<a href="/seasonSharing.htm?action=offline&id=${event.id}&season=${season.id}">Make Available Offline</a>
					<c:set var="contentDisplayed" value="true"/>
				</c:if>
				<c:if test="${not isServer or relevantFollower.admin}">
					<c:if test="${contentDisplayed}">
						|
					</c:if>
					<a href="#" onclick='deleteObject(event, eventGroupings[${event.id}].name, ${event.id}, "/eventGrouping.htm?season=${season.id}", {doNotEncode : true})'>Delete</a>
					<c:set var="contentDisplayed" value="true"/>
				</c:if>
			</td>
		</tr>
	</se:eventIter>
	<tr class='thebottomrow'>
		<td colspan="2">
			&nbsp;
			<c:if test="${relevantFollower.admin and not isServer}">
				Create a new 
				<c:forEach items="${topLevelTypes}" var="groupingType" varStatus="incr">
					${not incr.last and fn:length(topLevelTypes) > 1 ? '' : 'or ' } <a href="/eventSetup.htm?season=${season.id}&seriesId=${groupingType.parentSeries.id}">${groupingType.name}</a>${not incr.last ? ', ' : '' }
				</c:forEach>
			</c:if>
		</td>
	</tr>
	</tbody>
</table>
</div>

</form>

</div>

</div></div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>