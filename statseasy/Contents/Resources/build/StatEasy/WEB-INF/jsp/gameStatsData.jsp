<script type="text/javascript" defer="defer">
var allStatTypes = {
	<c:forEach items="${allStatTypes}" var="statType">
		${statType.id}: {
			id: Number(${statType.id}),
			shortcut: '${statType.shortcut}',
			maskedShortcut: '${statType.maskedShortcut}',
			name: '${statType.name}',
			parseInformation: '${statType.parseInformation}'
		},
	</c:forEach>
};

var allPlayers = {
	<c:forEach items="${allPlayersInSeason}" var="playerInSeason">
		${playerInSeason.player.id}: {
			id: Number(${playerInSeason.player.id}),
			firstName: '${playerInSeason.player.firstName}',
			lastName: '${playerInSeason.player.lastName}',
			number: Number(${playerInSeason.number}),
			shortcut: '${playerInSeason.shortcut}'
		},
	</c:forEach>
};

var allOpponents = {
	<c:forEach items="${allOpponents}" var="playerInSeason">
		${playerInSeason.player.id}: {
			id: Number(${playerInSeason.player.id}),
			firstName: '${playerInSeason.player.firstName}',
			lastName: '${playerInSeason.player.lastName}',
			number: Number(${playerInSeason.number}),
			shortcut: '${playerInSeason.shortcut}'
		},
	</c:forEach>
};

var allStats = [
	<c:forEach items="${game.allStats}" var="stat">
		{
			id: Number(${stat.id}),
			newStat: ${rowCounter.count <= statCount},
			statType: allStatTypes['${stat.statType.id}'],
			statData: [
				<c:forEach items="${stat.allData}" var="statData">
					{
						id: Number(${statData.id}),
						<c:choose>
							<c:when test="${not empty statData.player}">
						player: allPlayers[${statData.player.id}]
							</c:when>
							<c:otherwise>
						numericalData: Number(${statData.numericalData})
							</c:otherwise>
						</c:choose>
					},
				</c:forEach>
			]
		},
	</c:forEach>
	];

var currentGameState = {
	<c:forEach items="${game.currentState.allProperties}" var="gameStateProperty">
		${gameStateProperty.name} : '${gameStateProperty.value}',
	</c:forEach>		
};

var gameInfo = {
	ourTeamName : '${game.match.ourSeason.team.teamName}',
	theirTeamName : '${game.match.theirSeason.team.teamName}',
};
</script>