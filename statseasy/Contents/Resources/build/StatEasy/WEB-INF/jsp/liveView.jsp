<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<script type="text/javascript" src="/js/encoder.js?sv=${serverVersion}"></script>
<script type="text/javascript" src="/js/common.js?sv=${serverVersion}"></script>

<div id="content"><div id="innercontent">
<div class="middle">

<c:choose>
  <c:when test="${empty liveView.id}">
	<h2 class="titleBorder borderBelow">New Live View:</h2>
  </c:when>
  <c:otherwise>
	<h2 class="titleBorder borderBelow">Edit Live View '${liveView.displayName}':</h2>
  </c:otherwise>
</c:choose>
    
<form:form method="post" commandName="liveView" enctype="multipart/form-data">

<table>
  <tr>
    <td>Display Name:</td>
    <td><form:input cssClass="autofocus" path="displayName"/></td>
	<td><form:errors path="displayName" cssClass="formErrors"/></td>
  </tr>
  <tr>
    <td>Display Order:</td>
    <td><form:input path="displayOrder"/></td>
	<td><form:errors path="displayOrder" cssClass="formErrors"/></td>
  </tr>
  <tr>
    <td>Display During Video Replay:</td>
    <td><form:checkbox path="displayInVideoReplay"/></td>
	<td><form:errors path="displayInVideoReplay" cssClass="formErrors"/></td>
  </tr>
  <tr>
    <td>Display In Playlist Replay:</td>
    <td><form:checkbox path="displayInPlaylistReplay"/></td>
	<td><form:errors path="displayInPlaylistReplay" cssClass="formErrors"/></td>
  </tr>
  <tr>
    <td>Display In Media View:</td>
    <td><form:checkbox path="displayInMediaView"/></td>
	<td><form:errors path="displayInMediaView" cssClass="formErrors"/></td>
  </tr>
  <tr>
	<td>Contents:</td>
	<td>
	  <c:choose>
	  	<c:when test="${not empty liveView.contents}">
	  	  <a href="javascript:editUploadable(1);" id="editMeLink1">Change '${liveView.className} (v${liveView.version})'</a>
	  	  <input id="uploadLocator1" style="display:none" type="file" name="file"/>
	  	  <input type="hidden" name="editLiveView" value="0" id="editIndicator1"/>
	  	</c:when>
	  	<c:otherwise>
	  	  <input id="uploadLocator1" type="file" name="file"/>
	  	  <input type="hidden" name="editLiveView" value="1" id="editIndicator1"/>
	  	</c:otherwise>
	  </c:choose>
	</td>
	<td><form:errors path="contents" cssClass="formErrors"/></td>
  </tr>
  <tr>
	<td>Style (optional):</td>
	<td>
	  <c:choose>
	  	<c:when test="${not empty liveView.style}">
	  	  <a href="javascript:editUploadable(2);" id="editMeLink2">Change style</a>
	  	  <input id="uploadLocator2" style="display:none" type="file" name="styleFile"/>
	  	  <input type="hidden" name="editLiveViewStyle" value="0" id="editIndicator2"/>
	  	</c:when>
	  	<c:otherwise>
	  	  <input id="uploadLocator2" type="file" name="styleFile"/>
	  	  <input type="hidden" name="editLiveViewStyle" value="1" id="editIndicator2"/>
	  	</c:otherwise>
	  </c:choose>
	</td>
	<td><form:errors path="style" cssClass="formErrors"/></td>
  </tr>
</table>


<c:choose>
  <c:when test="${empty liveView.id}">
	<input class="hoverGreen" type="submit" name="submit" value="Create this live view"/>
  </c:when>
  <c:otherwise>
	<input class="hoverGreen" type="submit" name="submit" value="Save my changes"/>
  </c:otherwise>
</c:choose>
<input class="hoverRed" type="submit" name="submit" value="Cancel"/>

</form:form>

</div>
</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>