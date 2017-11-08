<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<div id="content"><div id="innercontent">

<c:choose>
  <c:when test="${empty sport.id}">
	<h2>Let's create a new sport...</h2>
  </c:when>
  <c:otherwise>
	<h2>Edit Sport '${sport.name}':</h2>
  </c:otherwise>
</c:choose>
    
<form:form method="post" commandName="sport">

<table>
  <tr>
    <td>
    	<span class="formLabel">Enter the name of the sport here:</span><br/>
    	<span class="tinyHelpText">FYI...we're going to put this name on the main Welcome page; so make sure it's a name you like.</span>
    </td>
    <td valign="top"><form:input cssClass="autofocus" path="name"/></td>    
  </tr>
</table>

<br/>

<form:errors cssClass="formErrors"/>
<input class="hoverGreen" type="submit" name="Submit" value="Create this sport"/>
<input class="hoverRed" type="submit" name="cancel" value="Cancel"/>

</form:form>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>