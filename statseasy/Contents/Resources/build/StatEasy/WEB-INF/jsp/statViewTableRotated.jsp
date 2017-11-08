
<c:set var="requestUrl" scope="page">/reports.htm?${urlArgs}</c:set>

<table class="striped statTable rotated">
	<thead>
	<tr>
		<c:choose>
			<c:when test="${not empty view.allGroups}">
				<th class="separatorCol" colspan="2">&nbsp;</th>
			</c:when>
			<c:otherwise>
				<th class="separatorCol">&nbsp;</th>
			</c:otherwise>
		</c:choose>
		
		<c:forEach items="${view.groups}" var="group">
			<c:choose>
			  	<c:when test="${includeVideoLinks}">
					<c:url var="url" value="${requestUrl}">
						<c:param name="action" value="watch" />
						<c:param name="row" value="${group.id}" />
						<c:param name="team" value="${view.team.id}" />
	  	  				<c:param name="op" value="${isOpponentView}" />
	  	  				<c:param name="viewIndex" value="${view.viewIndex }" />
					</c:url>
					<th><a href="${url}">${group.name}</a></th>
					</c:when>
					<c:when test="${linkToUpgrade}">
					  <th><a href="#" class="linkToUpgrade">${group.name}</a></th>
					</c:when>
				<c:otherwise>
					<th>${group.name}</th>
				</c:otherwise>
			</c:choose>
		</c:forEach>
		<c:if test="${view.totalRow}">
			<th>Total</th>
		</c:if>
	</tr>
	</thead>
	<tbody>
	<c:forEach items="${view.allColumns}" var="column">
	
		<c:choose>
			<c:when test="${column.separator}">
				<c:set var="thisRowStyle" scope="page" value="separatorRow"/>
			</c:when>
			<c:otherwise>
				<c:set var="thisRowStyle" scope="page" value=""/>
			</c:otherwise>
		</c:choose>
	
		<tr class="${thisRowStyle}">
		
			<c:if test="${not empty view.allGroups }">
				<c:set var="previousColGroup" scope="page" value="${currentColGroup }"/>
				<c:set var="currentColGroup" scope="page" value="${column.containingColumnGroup}"/>
			
				<c:choose>
					<c:when test="${currentColGroup != previousColGroup && not empty currentColGroup }">
						<td class="rowColumnGroup" rowspan="${currentColGroup.colspan }">${currentColGroup.name }</td>
					</c:when>
					<c:when test="${empty currentColGroup }">
						<td>&nbsp;</td>
					</c:when>
				</c:choose>
			</c:if>
		
			<td class="separatorCol">${column.name}</td>
			<c:forEach items="${view.groups}" var="group" varStatus="rowCounter">
				<td>
				<c:choose>
					<c:when test="${not empty column.columnData[rowCounter.index]}">
						  <c:set var="content" scope="page">
					      	<c:choose>
					      	  <c:when test="${column.formatType eq 'time'}">
							  	<se:formatTime value="${column.columnData[rowCounter.index]}"></se:formatTime>
							  </c:when>
							  <c:otherwise>
							    <fmt:formatNumber value="${column.columnData[rowCounter.index]}" 
						  						  type="${column.formatType}"
												  pattern="${column.formatPattern}" />
							  </c:otherwise>
							</c:choose>
						  </c:set>
						<c:choose>
							<c:when test="${includeVideoLinks}">
								<c:url var="url" value="${requestUrl}">
									<c:param name="action" value="watch" />
									<c:param name="column" value="${column.id}" />
									<c:param name="row" value="${group.id}" />
									<c:param name="team" value="${view.team.id}" />
									<c:param name="op" value="${isOpponentView}" />									
	  	  							<c:param name="viewIndex" value="${view.viewIndex }" />
								</c:url>
								<a href="${url}">${content}</a>
							</c:when>
							<c:when test="${linkToUpgrade}">
								<a href="#" class="linkToUpgrade">${content}</a>
							</c:when>
							<c:otherwise>
					  			${content}
					  		</c:otherwise>
						</c:choose>
					</c:when>
					<c:otherwise>
					    0
					</c:otherwise>
				</c:choose>
				</td>
			</c:forEach>
			<c:if test="${view.totalRow}">
				<td>
				<c:choose>
					<c:when test="${not empty column.totalRowData}">
					  <c:set var="content" scope="page">
				      	<c:choose>
				      	  <c:when test="${column.formatType eq 'time'}">
						  	<se:formatTime value="${column.totalRowData}"></se:formatTime>
						  </c:when>
						  <c:otherwise>
						    <fmt:formatNumber value="${column.totalRowData}" 
					  						  type="${column.formatType}"
											  pattern="${column.formatPattern}" />
						  </c:otherwise>
						</c:choose>
					  </c:set>
					
						<c:choose>
							<c:when test="${includeVideoLinks}">
								<c:url var="url" value="${requestUrl}">
									<c:param name="action" value="watch" />
									<c:param name="column" value="${column.id}" />
									<c:param name="team" value="${view.team.id}" />
									<c:param name="op" value="${isOpponentView}" />
	  	  							<c:param name="viewIndex" value="${view.viewIndex }" />
								</c:url>
								<a href="${url}">${content}</a>
							</c:when>
							<c:when test="${linkToUpgrade}">
								<a href="#" class="linkToUpgrade">${content}</a>
							</c:when>
							<c:otherwise>
				  				${content}
				  			</c:otherwise>
				  		</c:choose>
					</c:when>
					<c:otherwise>
						0
					</c:otherwise>
				</c:choose>
				</td>
			</c:if>
		</tr>
	</c:forEach>
	</tbody>
</table>
