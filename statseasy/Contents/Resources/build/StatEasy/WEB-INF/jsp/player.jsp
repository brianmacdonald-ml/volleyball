<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>
<script type="text/javascript">
	function error(name, description) {
		var start = name.indexOf("[");
		var end = name.indexOf("]");  
		if (start > 0 && end > 0 && end > start) {
			  this.name = name.substr(start + 1,end-start-1);
		} else {
			this.name = "None";
		}
		this.description = description;
	}
	var errors = new Array();
    <c:forEach items="${errors.fieldErrors}" var="error">
        errors.push(new error("${error.field}","${error.defaultMessage }"));
    </c:forEach>
</script>

<div id="content"><div id="innercontent">

<div id="formContent" class="middle">

<c:choose>
  <c:when test="${empty player.id}">
	<h2>New Player:</h2>
  </c:when>
  <c:otherwise>
	<h2>Edit player '${player.firstName} ${player.lastName}':</h2>
  </c:otherwise>
</c:choose>
    
<form:form method="post" commandName="player">

<table>
  <tr>
    <td>First Name:</td>
    <td><form:input cssClass="autofocus" path="firstName"/></td>
    <td><form:errors path="firstName" cssClass="formErrors"/></td>
  </tr>
  <tr>
    <td>Last Name:</td>
    <td><form:input cssClass="" path="lastName"/></td>
    <td><form:errors path="lastName" cssClass="formErrors"/></td>
  </tr>
  <tr>
    <td>Height:</td>
    <td><form:input cssClass="" path="height"/></td>
  </tr>
  <tr>
    <td>Weight:</td>
    <td><form:input cssClass="" path="weight"/></td>
  </tr>
  <tr>
    <td>Age:</td>
    <td><form:input cssClass="" path="birthday"/></td>
  </tr>
  <tr>
    <td>Hometown:</td>
    <td><form:input cssClass="" path="hometown"/></td>
  </tr>
</table>

<c:choose>
  <c:when test="${empty player.id}">
	<input class="hoverGreen" type="submit" name="submit" value="Create this player"/>
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