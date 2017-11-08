<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<div id="content"><div id="innercontent">

<div id="formContent" class="middle">

<h2 class="titleBorder borderBelow">You are about to delete the team '${team.teamName}'!</h2>
    
<form:form method="post" commandName="player">

<h2>Are you sure?</h2>
<ul>
	<li>This cannot be undone!</li>
	<li>All seasons for '${team.teamName}' will be deleted.</li>
	<li>All games for all seasons of the team '${team.teamName}' will be deleted.</li>
</ul> 

<br/>

<input class="hoverGreen" type="submit" name="submit" value="Delete This Team"/>
<input class="hoverRed" type="submit" name="submit" value="Cancel"/>

</form:form>

</div>

</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>