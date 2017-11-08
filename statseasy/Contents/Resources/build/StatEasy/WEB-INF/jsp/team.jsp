<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<div id="content"><div id="innercontent">

<div id="formContent" class="middle">

<c:choose>
  <c:when test="${empty team.id}">
	<h2>New Team:</h2>
  </c:when>
  <c:otherwise>
	<h2>Edit team '${team.teamName}':</h2>
  </c:otherwise>
</c:choose>
    
<form:form method="post" commandName="team">

<table>
  <tr>
    <td>Team Name:</td>
    <td><form:input cssClass="autofocus" path="teamName"/></td>
  </tr>
  <tr>
    <td>Show in dashboard dropdown:</td>
    <td><form:checkbox path="shown"/></td>
  </tr>
</table>

<c:choose>
  <c:when test="${empty team.id}">
	<input class="hoverGreen" type="submit" name="submit" value="Create this team"/>
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