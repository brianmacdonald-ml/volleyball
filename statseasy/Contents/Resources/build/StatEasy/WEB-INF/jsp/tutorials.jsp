<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<div id="content">
	<div id="innercontent">
		<div class="middle" id="formContent">
			<h2 class="borderBelow">${sportName} Tutorials</h2>
			<c:forEach items="${tutorialLinks}" var ="tutorial">
				<a href="${tutorial.link}" target="_blank">
				<div class="tutorial">
					<div class="thumbnail">
					<img src="${tutorial.thumbnail}" />
					</div>
					<div class="name">${tutorial.name}</div>
					<div class="description">${tutorial.description}</div>
				</div>
				</a>
			</c:forEach>
			<div class="clear"></div>
		</div>
	</div>
</div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>