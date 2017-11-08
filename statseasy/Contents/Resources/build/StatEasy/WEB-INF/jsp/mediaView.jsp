<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<script type="text/javascript" src="/js/jquery.metadata.js"></script>
<script type="text/javascript" src="/js/jquery.tablesorter.js"></script>
<script type="text/javascript" src="/js/stickyheaders.js"></script>
<link type="text/css" href="/css/jquery.ui/jquery-ui-1.8.2.custom.css" rel="stylesheet" />
<script src="/js/jquery.ui/jquery-ui-1.8.2.custom.js" type="text/javascript"></script>
<link rel="stylesheet" href="/css/jquery.validation/validationEngine.jquery.css" type="text/css" media="screen" charset="utf-8" />
<script src="/js/jquery.validation/jquery.validationEngine-en.js" type="text/javascript"></script>
<script src="/js/jquery.validation/jquery.validationEngine.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js"></script>
<script type="text/javascript" src="/js/common.js"></script>
<script type="text/javascript" src="/js/validateHelper.js"></script>
<script type="text/javascript" src="/js/liveParser.js"></script>
<script type="text/javascript" src="/js/data.js"></script>
<script type="text/javascript" src="/js/statEvent.js"></script>
<script type="text/javascript" src="/js/statList.js"></script>
<script type="text/javascript" src="/js/events.js"></script>
<script type="text/javascript" src="/js/utils.js"></script>
<script type="text/javascript" src="/js/liveViewManager.js"></script>
<script type="text/javascript" src="/js/jquery.color.js"></script>
<script type="text/javascript" src="/js/player-videoManager.js"></script>
<script type="text/javascript" src="/js/player-playlistMode.js"></script>
<script type="text/javascript" src="/js/player-reportMode.js"></script>
<script type="text/javascript" src="/js/player-singleEventGroupingMode.js"></script>
<script type="text/javascript" src="/js/player-noEventGroupingMode.js"></script>
<script type="text/javascript" src="/js/player.js"></script>
<link rel="stylesheet" href="/css/inputEvents.css" type="text/css">
<link rel="stylesheet" href="/css/statPlayer.css" type="text/css">
<link rel="stylesheet" href="/css/tableSort.css" type="text/css">

<div id="content"><div id="innercontent">

<table style="padding:0"><tr>
<td style="padding:0; vertical-align:top"><div class="liveViewContainer"></div></td>
</tr></table>

<c:forEach items="${allLiveViews}" var="liveView">
<script type="text/javascript" defer="defer">
${liveView.contents}
</script>
<style type="text/css">
${liveView.style}
</style>
</c:forEach>

</div></div>

<script type="text/javascript">
var crudUrl = '/take/gameStats.htm';
var dataUrl = '/video/video.htm';
var viewUrl = '/reports.htm';
	
$(document).ready(function () {
	
	new DataManager(crudUrl, dataUrl, undefined, false, function (newDataManager) {
		listenForStats("/videos.rt?clazz=stats", {}, newDataManager, null, "ws");
		
		newDataManager.viewUrl = viewUrl;
		LiveViewManager.drawLiveViewContainer(".liveViewContainer", [
			<c:forEach items="${allLiveViews}" var="liveView">
				{
						className: '${liveView.className}',
						displayName: '${liveView.displayName}',
						object: new ${liveView.className}('${liveView.className}_Div', newDataManager)
				},
			</c:forEach> 
		]);
		newDataManager.registerForNotification(DataManager.ADD,    LiveViewManager.notifyNewData);
		newDataManager.registerForNotification(DataManager.EDIT,   LiveViewManager.notifyNewData);
		newDataManager.registerForNotification(DataManager.DELETE, LiveViewManager.notifyNewData);
		newDataManager.registerForNotification(DataManager.ADD_TYPE, LiveViewManager.notifyNewData);
	}).getAllDataForEvent(${game.id});

});
</script>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>