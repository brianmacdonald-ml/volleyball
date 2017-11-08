<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<script type="text/javascript">

	var GET_VIDEO_PROGRESS_URL = "/video/video.htm?action=progress&video=";
	var GET_VIDEO_LIST_URL = "/video/videos.htm";

</script>

<script type="text/javascript" src="/js/addVideo.js"></script>

<div id="content"><div id="innercontent">

<div id='formContent' class='middle'>
	<c:choose>
		<c:when test="${not empty eventGrouping}">
			<h2>Add Video to ${eventGrouping.name}</h2>
			<c:if test="${not empty eventGrouping.allParentGroups}">
				<p>Member of:</p>
				<ul>
				<c:forEach items="${eventGrouping.allParentGroups}" var="parentGroup">
					<li>${parentGroup.name}</li>
				</c:forEach>
				</ul>
				<br/>
			</c:if>
			<input type="hidden" name="eventGrouping.id" value="${eventGrouping.id}" />
		</c:when>
		<c:otherwise>
			<h2>Add Video to StatEasy</h2>
		</c:otherwise>
	</c:choose>
	<div id="steps">
		<h3 id="step1">Select a video</h3>
		<div id="step1Stuff">
			<div class="heavyIndent">			
			<c:choose>
				<c:when test="${not empty event}">
					Browse to the video you wish to associate with this event.<br/>
				</c:when>
				<c:otherwise>
					Browse to the video you wish to import.<br/>
				</c:otherwise>
			</c:choose>		
				<span class="tinyHelpText">(To select more than one video, browse to each video one at a time.)</span>
				</div>
			<form:form method="post" commandName="gameVideoForm" enctype="multipart/form-data" id="videos">
			<div id="files">
			</div>
			<iframe id="upload_target" name="upload_target" src="" style="width:0;height:0;border:0px solid #fff;"></iframe>
			</form:form>
		</div>
		<h3 class="notyet" id="step2">Bring your videos into StatEasy</h3>
		<table id="uploadButtonTable" style="visibility: hidden">
			<tr>
				<td id="uploadTime"></td>
			</tr>
		</table>
		<div style="text-align:center;display:none;" id="waitForAMin">
			Your videos are being brought into StatEasy. This process may take a few minutes to complete.<br/>
			Please <span style="color:red;font-weight:bold;">do not leave this page</span> while this process is running. We'll let you know when it's done.<br/>
			<img src="/images/uploading_files.gif" style="margin:14px;" />
		</div>
		<h3 class="notyet" id="step3">Convert your videos</h3>
		<div id="step3Stuff"></div>
	</div>
	<h2 class="borderAbove"></h2>
	<c:choose>
		<c:when test="${not empty eventGrouping.ourSeason.id}">
			<input type="button" class="hoverRed" value="Cancel - I don't want to import video for this event" onclick='javascript: window.location="/take.htm?season=${ eventGrouping.ourSeason.id }"' />
		</c:when>
		<c:otherwise>
			<input type="button" class="hoverRed" value="Cancel - I don't want to import video" onclick='javascript: window.location="/video/videos.htm"' />
		</c:otherwise>
	</c:choose>	
</div>
<div id="progressBar"></div>

</div></div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>