<!DOCTYPE html>
<html>
<head>
<title>Descriptive</title>
<link rel="stylesheet"
	href="${request.contextPath}/bootstrap-4.3.1-dist/css/bootstrap.min.css">
</head>
<body>
	<script src="jquery/jquery-3.4.1.min.js"></script>
	<script
		src="${request.contextPath}/bootstrap-4.3.1-dist/js/bootstrap.min.js"></script>
	<button type="button" onClick="showAll()">show all</button>
	<button type="button" onClick="hideAll()">hide all</button>
	<div class="accordion" id="descriptiveCollapse">
		<div class="card">
			<div>
				<div>
					<table>
						<thead>
							<tr>
								<th></th>
								<th>SUM</th>
								<th>MIN</th>
								<th>AVG</th>
								<th>MAX</th>
								<th></th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td></td>
								<td>SUM</td>
								<td>MIN</td>
								<td>AVG</td>
								<td>MAX</td>
								<td><button type="button" class="showButton"
										onClick="collapseButton(this)" data-target="#collapseOne">show</button></td>
							</tr>
						</tbody>
					</table>

					<div id="collapseOne" class="collapse">
						<div>
							<div>
								<table>
									<tbody>
										<tr>
											<td></td>
											<td>SUM</td>
											<td>MIN</td>
											<td>AVG</td>
											<td>MAX</td>
											<td><button type="button" class="showButton"
													onClick="collapseButton(this)" data-target="#collapseTwo">show</button></td>
										</tr>
									</tbody>
								</table>
								<div id="collapseTwo" class="collapse">
									<div>
										<table>
											<tbody>
												<tr>
													<td></td>
													<td>SUM</td>
													<td>MIN</td>
													<td>AVG</td>
													<td>MAX</td>
												</tr>
											</tbody>
										</table>
									</div>
									<div>
										<table>
											<tbody>
												<tr>
													<td></td>
													<td>SUM</td>
													<td>MIN</td>
													<td>AVG</td>
													<td>MAX</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
							<br>
							<div>
								<table>
									<tbody>
										<tr>
											<td></td>
											<td>SUM</td>
											<td>MIN</td>
											<td>AVG</td>
											<td>MAX</td>
											<td><button type="button" class="showButton"
													onClick="collapseButton(this)" data-target="#collapseThree">show</button>
											</td>
										</tr>
									</tbody>
								</table>
								<div id="collapseThree" class="collapse">
									<div>
										<table>
											<tbody>
												<tr>
													<td></td>
													<td>SUM</td>
													<td>MIN</td>
													<td>AVG</td>
													<td>MAX</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<script>
		function collapseButton(x) {
			if (x.innerText === 'show') {
				$(x.getAttribute("data-target")).collapse('show');
				x.innerText = 'hide';
			} else {
				$(x.getAttribute("data-target")).collapse('hide');
				x.innerText = 'show';
			}
		}

		function showAll() {
			$('.collapse').collapse('show');
			$('.showButton').text('hide');
		}
		function hideAll() {
			$('.collapse').collapse('hide');
			$('.showButton').text('show');
		}
	</script>
</body>
</html>