<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css?sv=${serverVersion}" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js?sv=${serverVersion}" type="text/javascript"></script>
<script type="text/javascript" src="/js/encoder.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/jquery.progressbar.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/common.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/playlists.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/jquery.metadata.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/jquery.tablesorter.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/stickyheaders.js?sv=${serverVersion}"></script>
<link rel="stylesheet" href="/css/tableSort.css?sv=${serverVersion}" type="text/css">

<script type="text/javascript">
$(document).ready(function () {
	$(".tablesorter").tablesorter({
		sortList: [[0, 0]],
		headers: {  
            3: { // Third column, no sorting 
                sorter: false 
            },
		}
	});

	<c:forEach items="${playlistEncoders}" var="playlistEncoder">
	listenForProgress("/ws?clazz=playlists", {
		onComplete : function (mostRecent) {
			$("#playlistSaveAs" + mostRecent.id).show(500);
		}
	}, "${playlistEncoder.webSocketUrl}", "ws");
	</c:forEach>
});
</script>

<div id="content"><div id="innercontent">
<div class="middle">

<h2 class="titleBorder borderBelow">Manage and review your StatReels
	<c:if test="${isServer}">
		(${exportsRemaining} exports remaining)
	</c:if>
:</h2>
<span class="tinyHelpText">To create a StatReel, watch the video that contains the stats you want to add to the StatReel, and then click the <b>Show StatReels</b> option on the video menu bar.<br/>To add a stat to the StatReel, simply drag the stat from the video you are watching and drop it into the StatReel area.<br/><br/></span>
    
<table class="striped forNow tablesorter stickyHeaderTable" id="mainTable">
  <thead>
	<tr>
	  <th>StatReel Name</th>
	  <th># of Stats</th>
	  <th>Duration</th>
	  <th>Actions</th>
	</tr>
  </thead>
  <tbody>
	  <c:forEach items="${allPlaylists}" var="playlistShare">
	  	<c:set var="playlist" value="${playlistShare.playlist}"/>
	  	<tr>
	  	  <td>${playlist.name}</td>
		  <td>${fn:length(playlist.entries)}</td>
		  <td><script type="text/javascript">document.write(toTimeString(${playlist.durationSeconds}))</script></td>
		  <td>
		  	<a href="/playlists.htm?action=watch&id=${playlist.id}">Watch StatReel</a>
		  	| <a href="#" onclick='renamePlaylist(event, "${se:urlEncode(playlist.name)}", ${playlist.id}, "/playlists.htm?id=${playlist.id}")'>Rename</a>
		  	| <a href="#" onclick='deleteObject(event, "${se:urlEncode(playlist.name)}", ${playlist.id}, "/playlists.htm?id=${playlist.id}")'>Delete</a>
		  	<c:set var="display" value=""/>
		  	<c:set var="status" value=""/>
		  	<c:set var="displaySave" value="style='display:none'"/>
		  	<c:choose>
			  <c:when test="${playlist.status == 'WAITING'}">
				<c:set var="status" value="Waiting to encode"/>
			  </c:when>
			  <c:when test="${playlist.status == 'IN_PROGRESS'}">
			    <c:set var="status" value="Currently encoding"/>
			  </c:when>
			  <c:when test="${playlist.status == 'COMPLETE'}">
			    <c:set var="display" value="style='display:none'"/>
			    <c:set var="displaySave" value=""/>
			  </c:when>
			  <c:otherwise>
			    <c:set var="display" value="style='display:none'"/>
			    <c:if test="${playlistShare.admin and canExportPlaylists}">| <a href="/playlists.htm?action=export&id=${playlist.id}" class="export">Export</a></c:if>
			  </c:otherwise>
			</c:choose>
			
			<span id="playlistSaveAs${playlist.id}" ${displaySave}>| Export complete <a href="https://s3.amazonaws.com/playlists.getstateasy.com/${playlist.playlistExportFileName}?save=1">Click here to save...</a> | <a href="/playlists.htm?action=caption&id=${playlist.id}">Export captions</a></span>
	    	<div id="progress_${playlist.uuid}" class="progress" ${display}><span class="status">${status}</span><span class="progressBar"></span><span class="timeRemaining"></span><span class="message"></span></div>
		  </td>
		</tr>
	  </c:forEach>
  </tbody>
</table>

</div>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>