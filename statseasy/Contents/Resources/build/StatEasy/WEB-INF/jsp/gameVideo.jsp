<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<link rel="stylesheet" href="/css/jquery.validation/validationEngine.jquery.css" type="text/css" media="screen" charset="utf-8" />
<script src="/js/jquery.validation/jquery.validationEngine-en.js" type="text/javascript"></script>
<script src="/js/jquery.validation/jquery.validationEngine.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js"></script>
<script type="text/javascript" src="/js/jquery.tablesorter.js"></script>
<script type="text/javascript" src="/js/stickyheaders.js"></script>
<link rel="stylesheet" href="/css/tableSort.css" type="text/css">
<script type="text/javascript" src="/js/encoder.js"></script>
<script type="text/javascript" src="/js/common.js"></script>
<script type="text/javascript" src="/js/data.js"></script>
<script type="text/javascript" src="/js/timeline.js"></script>
<script type="text/javascript" src="/js/statEvent.js"></script>
<script type="text/javascript" src="/js/statList.js"></script>
<script type="text/javascript" src="/js/events.js"></script>
<script type="text/javascript" src="/js/gameVideo.js"></script>
<script type="text/javascript" src="/js/perspective.js"></script>
<script type="text/javascript" src="/js/paper.js"></script>
<script type="text/javascript" src="/js/canvas.js"></script>
<script type="text/javascript" src="/js/playlist.js"></script>
<script type="text/javascript" src="/js/player-videoManager.js"></script>
<script type="text/javascript" src="/js/player-playlistMode.js"></script>
<script type="text/javascript" src="/js/player-reportMode.js"></script>
<script type="text/javascript" src="/js/player-singleEventGroupingMode.js"></script>
<script type="text/javascript" src="/js/player-noEventGroupingMode.js"></script>
<script type="text/javascript" src="/js/player.js"></script>
<script type="text/javascript" src="/js/liveViewManager.js"></script>
<script type="text/javascript" src="/js/jquery.color.js"></script>
<script type="text/javascript" src="/js/liveParser.js"></script>
<link rel="stylesheet" href="/css/statPlayer.css" type="text/css">

<style type="text/css">
.activeContent {
	position: relative;
}
div.middle {
	position:relative;
}
.timeRemaining {
	position:absolute;
	top:10px;
	left:20px;
	color:red;
}
</style>

<div id="content"><div id="innercontent">
<div class="middle">

<c:if test="${not empty timeLeft}">
	<div class="timeRemaining">Estimated time left until video is available: <span class="timeLeft">${timeLeft}</span></div>
</c:if>

<c:choose>
  <c:when test="${not empty playlist.id}">
  	<h2 class="titleBorder borderBelow">Video for StatReel '${playlist.name}'</h2>
  </c:when>
  <c:when test="${not empty urlArgs}">
	<c:set var="requestUrl" scope="page">/reports.htm?${urlArgs}</c:set>
	<c:url var="reportUrl" value="${requestUrl}">
	  <c:param name="action" value="" />
	</c:url>
	<h2 class="titleBorder borderBelow">Video for <a href="${reportUrl}">Stat Report</a></h2>
  </c:when>
  <c:when test="${empty eventGrouping.id}">
	<h2 class="titleBorder borderBelow">Video: ${gameVideo.displayName }</h2>
  </c:when>
  <c:otherwise>
	<h2 class="titleBorder borderBelow">Video for ${eventGrouping.name}:</h2>
	<c:if test="${not empty eventGrouping.allParentGroups}">
		<p>Member of:</p>
		<ul>
		<c:forEach items="${eventGrouping.allParentGroups}" var="parentGroup">
			<li>${parentGroup.name}</li>
		</c:forEach>
		</ul>
		<br/>
	</c:if>
  </c:otherwise>
</c:choose>

<div id="statPlayer"></div>

</div>
</div></div>

<c:forEach items="${allLiveViews}" var="liveView">
<script type="text/javascript" defer="defer">
${liveView.contents}
</script>
<style type="text/css">
${liveView.style}
</style>
</c:forEach>

<script type="text/javascript">

<c:choose>
  <c:when test="${not empty urlArgs}">
	<c:set var="requestUrl" scope="page">/reports.htm?${urlArgs}</c:set>
	<c:url var="videoUrl" value="${requestUrl}">
	  <c:param name="format" value="json" />
	</c:url>
	var dataUrl = '${videoUrl}';
  </c:when>
  <c:otherwise>
	var dataUrl = '/video/video.htm';
  </c:otherwise>
</c:choose>
var crudUrl = '/take/gameStats.htm';
var playlistUrl = '/video/video.htm';

$(document).ready(function () {
	
	var dataManager = new DataManager(crudUrl, dataUrl, playlistUrl, ${not empty playlist.id}, function (newDataManager) {
		var player = new StatPlayer({
			id: "statPlayer", 
			dataManager: newDataManager,
			<c:if test="${not empty gameVideo}">
				startingVidId: ${gameVideo.id},
			</c:if>
			<c:set var="displayLiveViews">true</c:set>
			<c:choose>
			  <c:when test="${not empty playlist.id}">
			  	mode: StatPlayer.PLAYLIST_MODE,
			  </c:when>
			  <c:when test="${not empty urlArgs}">
				mode: StatPlayer.MULTIPLE_EVENT_GROUPING_MODE,
			  </c:when>
			  <c:when test="${empty eventGrouping.id}">
				mode: StatPlayer.NO_EVENT_GROUPING_MODE,
				<c:set var="displayLiveViews">false</c:set>
			  </c:when>
			</c:choose>
			<c:if test="${empty allLiveViews}">
				drawGameState: true,
			</c:if>
			<c:if test="${not empty isServer}">
				isServer: ${isServer},
			</c:if>
				username: "${user}"
		});
		<c:if test="${not empty allLiveViews && displayLiveViews}">
			LiveViewManager.drawLiveViewContainer("#statPlayer-gameState", [
				<c:forEach items="${allLiveViews}" var="liveView">
					{
						className: '${liveView.className}',
						displayName: '${liveView.displayName}',
						object: new ${liveView.className}('${liveView.className}_Div', newDataManager)
					},
				</c:forEach> 
			]);
		</c:if>
	});

	<c:choose>
	  <c:when test="${not empty playlist.id}">
	  	dataManager.getPlaylistInfo(${playlist.id}, undefined, true);
	  </c:when>
	  <c:when test="${not empty eventGrouping.id}">
		dataManager.getAllDataForGrouping(${eventGrouping.id});
	  </c:when>
	  <c:otherwise>
		dataManager.getAllDataForVideo(${gameVideo.id});
	  </c:otherwise>
	</c:choose>

	

});
</script>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>