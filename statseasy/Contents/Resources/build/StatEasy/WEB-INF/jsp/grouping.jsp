<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<script type="text/javascript" src="/js/configureView.js?sv=${serverVersion}"></script>

<div id="content"><div id="innercontent">

<c:choose>
  <c:when test="${empty group.id}">
	<h2>New Named Group:</h2>
  </c:when>
  <c:otherwise>
	<h2>Edit Named Group '${group.name}':</h2>
  </c:otherwise>
</c:choose>
    
<form:form method="post" commandName="group">

<table>
  <tr>
    <td>Group Name:</td>
    <td><form:input size="40" cssClass="autoFocus" path="name"/></td>
	<td><form:errors cssClass="formErrors" path="name"/></td>
  </tr>
  <tr>
    <td>Grouping Data:</td>
    <td><form:input size="40" path="groupingData"/></td>
	<td><form:errors cssClass="formErrors"  path="groupingData"/></td>
  </tr>
  <tr>
    <td>Default grouping?</td>
    <td><form:checkbox path="defaultGrouping" disabled="${group.defaultGrouping}"/></td>
	<td><form:errors cssClass="formErrors"  path="defaultGrouping"/></td>
  </tr>
</table>

<c:choose>
  <c:when test="${empty group.id}">
	<input class="hoverGreen" type="submit" name="submit" value="Create this named group"/>
  </c:when>
  <c:otherwise>
	<input class="hoverGreen" type="submit" name="submit" value="Save my changes"/>
  </c:otherwise>
</c:choose>
<input class="hoverRed" type="submit" name="submit" value="Cancel"/>

</form:form>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>