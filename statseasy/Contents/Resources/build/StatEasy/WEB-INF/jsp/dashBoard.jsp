<%@ page session="false"%>
<%@ taglib prefix="form"    uri="http://www.springframework.org/tags/form" %>
<%@ taglib prefix="c" 		uri="http://java.sun.com/jsp/jstl/core" %>
<%@ taglib prefix="se"      uri="/WEB-INF/tld/statEasy.tld" %>
<%@ taglib prefix="fmt" 	uri="http://java.sun.com/jsp/jstl/fmt" %>
<%@ include file="/WEB-INF/jsp/header.jsp" %>

<script type="text/javascript" src="/js/common.js"></script>
<script type="text/javascript">
	function getServerUpdates(dataUrl) {
		var options = {};
		
		options["action"] = "query";
		options["type"] = "js";
		
		$.getJSON(dataUrl,
			options,
			function (data, textStatus) {
				if (textStatus != "success") {
					console.log("There was an error while checking for sport updates.");
				} else {
					if (data.error != null) {
						console.log("There was an error while checking for sport updates.");
					} else if (data.newAgreements) {
						window.location = dataUrl + "?action=apply";
					} else {
						if (data.sportUpdates != null && data.sportUpdates.length > 0) {
							notification("You have sport updates waiting. <a class='gray_link' href='" + dataUrl + "?action=apply'>Click here</a> to apply the updates.", "yellow")
						} else {
							$("#sportUpdates").html("");
						}
					}
				}
			}
		);
	}

    function bubble(name, url, appendSeason) {
        this.name = name;
        this.url = url;
        this.appendSeason = appendSeason;
    }
    var bubbles = {
        "viewStats" : new bubble("viewStats", "/take.htm", true),
        "videoList" : new bubble("videoList", "/video/videos.htm", true),
        "setupTeamAndSeason" : new bubble("setupTeamAndSeason", "/teamAndSeasonSetup.htm", false),
        "setupEvent" : new bubble("setupEvent", "/eventSetup.htm", true),
        "manageImports" : new bubble("manageImports", "/importExport.htm", true),
    	"playlistListing" : new bubble("playlistListing", "/playlists.htm", false)
    };
    var importsUrl = '/launch.htm';
    
$(document).ready(function(){
	getUnresolvedSharedVideos(importsUrl);
	getServerUpdates("/hello.htm");
});
</script>

<script type="text/javascript" src="/js/jquery.plugins/jquery.cookie.js"></script>
<script type="text/javascript" src="/js/dashBoard.js"></script>

<div id="content"><div id="innercontent">
<c:if test="${not empty teams}">
<div id="teamAndSeasonInfo">
	<b>Team:</b> 
		<select id="defaultTeam">
	    	<c:forEach items="${teams}" var="team" varStatus="rowCounter">
	    		<option value="${team.id}">${team.teamName}</option>
			</c:forEach>		
		</select>
		<c:if test="${not empty teamToSeasons}">
	<b>Season:</b>
		<c:forEach items="${teamToSeasons}" var="seasons">
			<select id="seasonForTeam${seasons.key}" class="seasonSelection" style="display:none;">
		    	<c:forEach items="${seasons.value}" var="season">
		    		<option value="${season.id}">${season.name}</option>
		    		<script type="text/javascript">
		    			seasons.push(new season("${season.id}"));
		    		</script>
				</c:forEach>
			</select>
		</c:forEach>
		</c:if>
</div>
</c:if>

<table class="dashboard">
	<tr>
		<td>
		  <c:choose>
		    <c:when test="${empty teams}">
				<div class="disabledBubble">
				     VIEW STATS FOR YOUR TEAM
				</div>
		    </c:when>
		    <c:otherwise>
				<div class="bubble" id="viewStats">
					<div class="bubbleBottom">
			     	VIEW STATS FOR YOUR TEAM
			     	</div>
				</div>
		    </c:otherwise>
		  </c:choose>
		</td>
		<td>
		  <c:choose>
		    <c:when test="${empty teams}">
				<div class="disabledBubble">
					SET UP A 
					<span class="uppercase"><se:displayTypeNames types="${eventTypes }"/></span>
				</div>
		    </c:when>			
			<c:otherwise>
				<div class="bubble" id="setupEvent">
					SET UP A
					<span class="uppercase"><se:displayTypeNames types="${eventTypes }"/></span>
				</div>
		  	</c:otherwise>
		  </c:choose>
		</td>
		<td>
		  <c:choose>
		    <c:when test="${empty teams}">
				<div class="disabledBubble">
				     MANAGE STATREELS
				</div>
		    </c:when>
		    <c:otherwise>
				<div class="bubble" id="playlistListing">
				     MANAGE STATREELS
				</div>
		    </c:otherwise>
		  </c:choose>		
		</td>
	</tr>
	<tr>
		<td>
		  <c:choose>
		    <c:when test="${empty teams}">
				<div class="attentionBubble" id="setupTeamAndSeason">
				     SET UP A TEAM AND SEASON
				     <br/><span class="tinyHelpText">You must create a team and season.</span>
				</div>
		    </c:when>
		    <c:otherwise>
				<div class="bubble" id="setupTeamAndSeason">
				     SET UP A TEAM AND SEASON
				</div>
		    </c:otherwise>
		  </c:choose>
		</td>
		<td>
		  <c:choose>
		    <c:when test="${empty teams}">
				<div class="disabledBubble">
				     MANAGE VIDEOS
				</div>
		    </c:when>		    
		    <c:when test="${empty unassignedVids}">
				<div class="bubble" id="videoList">
				     MANAGE VIDEOS
				</div>
		    </c:when>
		    <c:otherwise>
				<div class="attentionBubble" id="videoList">
				     MANAGE VIDEOS
				     <br/><span class="tinyHelpText">You have unassigned videos.</span>
				</div>
		    </c:otherwise>
		  </c:choose>
		</td>
		<td>
		  <c:choose>
		    <c:when test="${empty unresolvedImports and empty unresolvedShares}">
				<div class="bubble" id="manageImports">
				     MANAGE STAT IMPORTS
				     <br/><span class="tinyHelpText" id="sharedVideos">Checking for new shared videos... <img src="/images/loading.gif"/></span>
				</div>
		    </c:when>
		    <c:otherwise>
				<div class="attentionBubble" id="manageImports">
				     MANAGE STAT IMPORTS
				     <c:choose>
					     <c:when test="${not empty unresolvedImports}">
					     <br/><span class="tinyHelpText">You have unresolved imports.</span>
					     </c:when>
				     </c:choose>
				     <br/><span class="tinyHelpText" id="sharedVideos">Checking for new shares... <img src="/images/loading.gif"/></span>
				</div>
		    </c:otherwise>
		  </c:choose>
		</td>		
	</tr>
</table>

</div></div>

<%@ include file="/WEB-INF/jsp/footer.jsp" %>