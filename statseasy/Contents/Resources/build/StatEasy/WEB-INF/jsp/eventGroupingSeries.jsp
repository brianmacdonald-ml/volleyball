<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ taglib prefix="fn" 		uri="http://java.sun.com/jsp/jstl/functions" %>

<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>

<div id="content"><div id="innercontent">
<div class="middle">

<h2 class="titleBorder borderBelow">Event Groupings:</h2>

<div class="groupingSeries">
	<h3><a href="#">Tournament</a></h3>
	<div class="groupingType">
		<table>
			<tr>
				<td>Name Format:</td>
				<td><input type="text"/></td>
			</tr>
		</table>
	</div>
	<h3><a href="#">Match</a></h3>
	<div class="groupingType">
		<table>
			<tr>
				<td>Name Format:</td>
				<td><input type="text"/></td>
			</tr>
		</table>
	</div>
	<h3><a href="#">Game</a></h3>
	<div class="groupingType">
		<table>
			<tr>
				<td>Name Format:</td>
				<td><input type="text"/></td>
			</tr>
		</table>
	</div>
</div>

<script type="text/javascript">
$(document).ready(function () {
	$(".groupingSeries h3").click(function () {
		$(this).next().toggle("slow");
		return false;
	}).next().hide();
});
</script>

</div>
</div></div>


<%@ include file="/WEB-INF/jsp/footer.jsp" %>