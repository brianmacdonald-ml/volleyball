<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<link rel="stylesheet" href="/css/jquery.validation/validationEngine.jquery.css" type="text/css" media="screen" charset="utf-8" />
<script src="/js/jquery.validation/jquery.validationEngine-en.js" type="text/javascript"></script>
<script src="/js/jquery.validation/jquery.validationEngine.js" type="text/javascript"></script>
<script type="text/javascript" src="/js/validateHelper.js"></script>
<script type="text/javascript">
	$(function() {
		$('.sport_check').click(function (e) {
			if ($(e.target).attr("type") != "checkbox") {
				$(this).find('input')[0].checked=!$(this).find('input')[0].checked;
			}
		})
	})
</script>

<div id="content"><div id="innercontent">
<div id="formContent" class="middle">

<h1>StatEasy can't reach its home server.</h1>
<p>Check your internet connection and try again.</p>
<p>Thankfully, you'll only ever need to be connected to the internet the very first time you start StatEasy.  After this it's smooth sailing.</p>

</div>
</div></div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>