<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>
<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js?sv=${serverVersion}"></script>

<style type="text/css">
	#navigation li, #gameType {
		visibility: hidden;
	}

</style>
		

<div id="content"><div id="innercontent">
	<div id="welcome">
		<h2>StatEasy</h2>
		<h3>Your Stats at Full Potential&trade;</h3>
		<div class="centerText gimmeroom">

	    <c:forEach items="${allSports}" var="sport" varStatus="rowCounter">
		  <p class="skinny"><a href="${forwardTo}" onclick='$.cookie("sport", "${sport.name}", { path : "/"})' class="sportSelection">${sport.name}</a></p>
	    </c:forEach>
		<p class="centerText">
		</p>
		<p>Your copy of StatEasy is currently configured for the above sports. Select one to get started.</p>
		<p><a href="${serverUrl}account/profile?requestLogin=true" target="_blank">Need another sport?</a></p>
		</div>
	</div>
</div></div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>