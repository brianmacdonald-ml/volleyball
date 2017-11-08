<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<%@ include file="/WEB-INF/jsp/configurationNavigation.jsp" %>
<%@ include file="/WEB-INF/jsp/validateHelper.jsp" %>

<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js?sv=${serverVersion}"></script>

<div id="content"><div id="innercontent">
<div class="middle">

<h2 class="titleBorder borderBelow">Advanced <a href="/configure/configure.htm?sportSelect=true" onclick='$.cookie("sport", "", { path : "/"})'>${sportName}</a> Configuration</h2>

<table>
<tr><td>
<a href="/configure/configure.htm?export=yes">Export all StatEasy Configuration</a>
    
<form method="post" action="/configure/configure.htm" enctype="multipart/form-data">
<input type="file" name="file">
<input type="submit" name="Submit" value="Upload"/>
</form>

</td></tr>
</table>

<form method="post" action="/configure/configure.htm"  id="mediaViewConfig">

<input type="hidden" name="action" id="action" value="media" />

<h2 class="titleBorder borderBelow">Media View</h2>

<table>
  <tr>
    <td>Enable Media View for this sport</td>
    <td><input type="checkbox" name="mediaViewEnabled" id="mediaViewEnabled" value="1" <c:if test="${isMediaViewSport}">checked</c:if> /></td>
  </tr>
  <tr class="mediaView">
  	<td>Media View Season</td>
  	<td><select name="mediaViewSeason" id="mediaViewSeason">
		<c:forEach items="${seasons}" var="season">
  			<option value="${season.id}"<c:if test="${mediaViewSeason == season.id}"> selected</c:if>>${season.team.teamName} - ${season.name}</option>
		</c:forEach>
		<c:if test="${empty seasons}">
  		<option value="-999">-- No seasons exist yet --</option>
  		</c:if>
  	</select></td>
  </tr>
  <tr class="mediaView">
  	<td>Media View Game</td>
  	<td><select name="mediaViewGame" id="mediaViewGame">
  	</select></td>
  </tr>
  <tr>
  	<td colspan="2"><input type="button" name="submitForm" id="submitForm" value="Save Media View Changes" /></td>
  </tr>
</table>

</form>

</div>
</div></div>

<script type="text/javascript">
$(function() {
	var mediaViewGame = 0;
	<c:if test="${mediaViewGame != null}">
	mediaViewGame = ${mediaViewGame};
	</c:if>
	
	$('#mediaViewEnabled').change(function() {
		if ($(this).is(':checked')) {
			$('.mediaView').show();
		} else {
			$('.mediaView').hide();
		}
	});
	
	$('#mediaViewSeason').change(function() {
		$.ajax({ url : '/configure/configure.htm?season=' + $(this).val() + '&action=season', 
				 success : function(data) {
					$('#mediaViewGame option').remove();
					for (var game in data) {
						var selected = "";
						if (mediaViewGame == data[game].id) {
							selected = " selected";
						}
						$('#mediaViewGame').append("<option value='" + data[game].id + "'" + selected + ">" + data[game].name + "</option>");
					}
		
					if (data.length == 0) {
						$('#mediaViewGame').append("<option value='-1'>-- No games available --</option>");
					}
				}, 
				error : function(error) {
					$('#mediaViewGame option').remove();
					$('#mediaViewGame').append("<option value='-1'>-- No games available --</option>");
				}
		});
	});
	
	$('#submitForm').click(function() {
		// Validate game
		if ($('#mediaViewGame').val() == -1) {
			buildPromptAndBinding("mediaViewGame", "A valid game must be selected.");
			return null;
		}
		
		$('#mediaViewConfig').submit();
	});
	
	$('#mediaViewEnabled').change();
	$('#mediaViewSeason').change();
});
</script>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>