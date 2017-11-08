<%@ page session="false"%>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<script type="text/javascript">

var eventGroupings = ${allGroupingsInJson};

</script>

<div style="display:none;padding:10px;" id="selectEvent" title="Assign video to which event?">

<table cellspacing="0" class="striped forNow" style="width:100%">
	<tr>
		<th width="75%"><img id='open_close_all' class='open_close' src='/images/minus.png'/><input type="checkbox" name="selectAllEvents" id="selectAllEvents"/><span style="margin-left: 10px">Name</span></th>
		<th style="text-align:center"># of Videos</th>
	</tr>
	<se:eventIter items="${topLevelGroupings}" season="${season}">
		<tr class="depth${depth} eventRow" id="eventId${event.id}">
			<td style="padding-left: ${10 + depth * 30}px">
				<c:if test="${not leaf}">
					<img class='open_close' src='/images/minus.png'/>
				</c:if>
				<input type="radio" name="egId" value="${event.id}"/>
				${event.name}
			</td>
			<td style="text-align:center;border-left: 1px solid black">
				<c:choose>
					<c:when test="${not empty event.allVideos}">
						${fn:length(event.allVideos)}
					</c:when>
					<c:otherwise>
						&nbsp;
					</c:otherwise>
				</c:choose>
			</td>
		</tr>
	</se:eventIter>
</table>

</div>