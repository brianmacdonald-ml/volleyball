<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.shorten.js"></script>
<script type="text/javascript" src="/js/encoder.js"></script>
<script type="text/javascript" src="/js/common.js"></script>
<script type="text/javascript" src="/js/jquery.progressbar.js"></script>
<script type="text/javascript" src="/js/videos.js"></script>

<script type="text/javascript">
$(function() {
	$('#help').click(function() {
		$('.helpDialog').dialog({
			modal : true,
			width : 400
		});
	})
});
</script>

<div id="content"><div id="innercontent">
<div class="middle">

<div class="helpDialog">
	<table>
		<tr><td><img src="/images/videostatus_downloading.png" /></td><td>You are currently downloading this video. You'll be able to view it when finished.</td></tr>
		<tr><td><img src="/images/videostatus_uploading.png" /></td><td>This video is being uploaded to the cloud. If you created the video initially, other users may not be able to download it unless your StatEasy continues running.</td></tr>
		<tr><td><img src="/images/videostatus_complete.png" /></td><td>You have this video and it has been uploaded completely to the cloud. Other users can download it even if you close StatEasy (but they'll get it quicker if you leave StatEasy running)</td></tr>
		<tr><td><img src="/images/videostatus_encodingInProgress.png" /></td><td>This video is currently encoding.</td></tr>
	</table>
</div>

<h2 class="titleBorder borderBelow">Manage and review your videos:</h2>
<span class="tinyHelpText">To import a video into StatEasy, simply drag and drop the video file onto the small <b>StatEasy is running...</b> window or click the <b>Browse to files...</b> button on that window. <br/><b>While the video is uploading or encoding, you can always continue to use StatEasy.</b><br/><br/><span class="helpLine"><a href="#" id="help">What do these symbols mean? <img src="/images/videostatus_downloading.png" /><img src="/images/videostatus_uploading.png" /><img src="/images/videostatus_complete.png" /><img src="/images/videostatus_encodingInProgress.png" /></a></span><br /><br /></span>
    
    <div id="progress"></div>

<form action='/video/video.htm' method="get">
<input type="hidden" name="action" value="merge"/>
<input type="hidden" name="season" value="${season.id}"/>

<c:if test="${fn:length(allVideos) > 10}">
<input type="submit" value="Merge Videos" class="mergeVideos" disabled="disabled"/>
</c:if>


<table cellspacing="0" class="striped forNow manageVideos" id="mainTable">
  <tr>
  	<th>&nbsp;</th>
    <th>Video Name</th>
    <th>Duration</th>
	<th>Actions</th>
	<th class="right">Video Status</th>
  </tr>
  <c:forEach items="${allVideos}" var="event">
    <tr class="eventName">
    <td colspan="6">${event.key}</td>
    </tr>
  	<c:forEach items="${event.value}" var="video">
  	<tr>
  	  <td width="20"><input type="checkbox" name="mergeVideos" value="${video.id}"/></td>
  	  <td width="400"><a href="/video/video.htm?action=watch&gameVideo=${video.id}"><span class="shorten" data-size="30">${video.displayName}</span></a></td>
  	  <td width="100"><script type="text/javascript">document.write(toTimeString(${video.duration}, 2))</script></td>
	  <td width="200">
	  <select class="actions" id="actions_${video.id}">
	  	<option id="default">--- Choose an action ---</option>
	  	<c:if test="${not empty video.eventGrouping && not empty video.eventGrouping.associatedEvent}">
	  	  <option data-link="/take/gameStats.htm?id=${video.eventGrouping.associatedEvent.id}">Take stats</option>
	  	</c:if>
	  	<!-- <span id="videoWatchLink${video.id}"> -->
	  	  <option data-link="/video/video.htm?action=watch&gameVideo=${video.id}">Watch video</option>
	  	<!-- </span> -->
	  	
	  	<c:set var="linkText" value="Associate to an event"/>
	  	<c:if test="${not empty video.eventGrouping}">
	  		<c:set var="linkText" value="Change event association"/>
	  	</c:if>
	  	<c:set var="returnTo" value=""/>
	  	<c:if test="${not empty returnToGameId}">
	  		<c:set var="returnTo" value="&returnTo=${returnToGameId}"/>
	  	</c:if>
	  	
	  	<option data-link='/video/assignToGame.htm?gameVideo=${video.id}&season=${season.id}${returnTo}'>${linkText}</option>
	  	<option data-fn='renameVideo(event, "${se:urlEncode(video.displayName)}", ${video.id}, "/video/video.htm?season=${season.id}")'>Rename</option>
	  	<option data-fn='deleteObject(event, "${se:urlEncode(video.displayName)} (this will also delete the video from StatEasy)", ${video.id}, "/video/video.htm?season=${season.id}")'>Delete</option>
	  	<c:if test="${fn:length(video.segments) > 1}">
	  	<option data-link="/video/video.htm?season=${season.id}&id=${video.id}&action=split">Split</option>
	  	</c:if>
	  </select>
	  	
	  	<c:if test="${fn:length(video.segments) == 1}">
	  		<c:set var="segment" value="${video.segments[0]}"/>
		  	<c:set var="display" value=""/>
		  	<c:set var="status" value=""/>
		  	<c:choose>
			  <c:when test="${segment.status == 'uploaded'}">
				<c:set var="status" value="Waiting to encode"/>
			  </c:when>
			  <c:when test="${segment.status == 'encodingInProgress'}">
			    <c:set var="status" value="Currently encoding"/>
			  </c:when>
			  <c:otherwise>
			    <c:set var="display" value="style='display:none'"/>
			  </c:otherwise>
			</c:choose>
			
			<c:set var="downloadClass" value=""/>
		  	<c:if test="${segment.status == 'downloadingFromServer'}">
		  		<c:set var="downloadClass" value="downloading" />
		  	</c:if>
	  	</c:if>
	  </td>
	  <td class="right">
	  	<c:if test="${fn:length(video.segments) == 1}">
		  	<div id="torrenticon_${segment.uuid}" class="torrenticon">
	  	  			<img src="/images/videostatus_${segment.status}.png" />
	  	  	</div>
	  	  	<div id="progress_${segment.uuid}" class="upload_progress progress ${downloadClass}" style="display:none;">
	  	  		<div class="progresstop"><span class="progressBar"></span></div>
	  	  		<div class="progressbottom"><span class="status"></span><span class="timeRemaining"></span><span class="message"></span></div>
	  	  	</div>
  	  	</c:if>
	    <input type="hidden" class="segmentUuid" value="${segment.uuid}" />
  	  </td>
  	  
	  <c:if test="${fn:length(video.segments) > 1}">
		  <c:forEach items="${video.segments}" var="segment">
		  	<tr>
		  	  <td style="width:20px">&nbsp;</td>
		  	  <td><span class="shorten" data-size="30">${segment.displayName}</span></td>
		  	  <td><script type="text/javascript">document.write(toTimeString(${segment.duration}, 2))</script></td>
		  	  <td class="indent">
		  		<a href="#" onclick='renameSegment(event, "${se:urlEncode(segment.displayName)}", ${segment.id}, "/video/video.htm?season=${season.id}")'>Rename</a>
			  	<c:set var="display" value=""/>
			  	<c:set var="status" value=""/>
			  	<c:choose>
				  <c:when test="${segment.status == 'uploaded'}">
					<c:set var="status" value="Waiting to encode"/>
				  </c:when>
				  <c:when test="${segment.status == 'encodingInProgress'}">
				    <c:set var="status" value="Currently encoding"/>
				  </c:when>
				  <c:otherwise>
				    <c:set var="display" value="style='display:none'"/>
				  </c:otherwise>
				</c:choose>
				
				<c:set var="downloadClass" value=""/>
			  	<c:if test="${segment.status == 'downloadingFromServer'}">
			  		<c:set var="downloadClass" value="downloading" />
			  	</c:if>
		  	  </td>
		  	  <td class="right">
		  	  	<div id="torrenticon_${segment.uuid}" class="torrenticon">
		  	  		<img src="/images/videostatus_${segment.status}.png" />
		  	  	</div>
		  	  	<div id="progress_${segment.uuid}" class="upload_progress progress ${downloadClass}" style="display:none;">
		  	  		<div class="progresstop"><span class="progressBar"></span></div>
		  	  		<div class="progressbottom"><span class="status"></span><span class="timeRemaining"></span><span class="message"></span></div>
		  	  	</div>
			    <input type="hidden" class="segmentUuid" value="${segment.uuid}" />
		  	  </td>
		  	</tr>
		  </c:forEach>
	  </c:if>
	</tr>
	</c:forEach>
  </c:forEach>
  
  <tr class="thebottomrow">
  	<td colspan="7"><input type="submit" value="Merge Videos" class="mergeVideos" disabled="disabled"/></td>
  </tr>
</table>

</form>

</div>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>