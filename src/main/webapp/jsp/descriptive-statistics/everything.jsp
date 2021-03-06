<!DOCTYPE html>
<html>
<head>
<title>Descriptive</title>
<link rel="stylesheet"
	href="${request.contextPath}/bootstrap-4.3.1-dist/css/bootstrap.min.css">
<link rel="stylesheet" type="text/css" href="css/simple.css" />
</head>
<body>
	<script src="jquery/jquery-3.4.1.min.js"></script>
	<script src="numeral/numeral.min.js"></script>
	<script
		src="${request.contextPath}/bootstrap-4.3.1-dist/js/bootstrap.min.js"></script>
	<button type="button" onClick="showAll()">show all</button>
	<button type="button" onClick="hideAll()">hide all</button>
	<div class="accordion" id="descriptiveCollapse">
		<table id="tableAll"></table>
		<div id="collapseOne" class="collapse"></div>
	</div>
	<div style="margin-top: 2em;">
		<a href="/descriptive">
			<button class="block">back</button>
		</a>
	</div>
	<script>
		$.ajax({
			method : "GET",
			url : "/descriptive/everything",
			success : function(result) {
				var data = result["data"];
				for ( var key in data) {
					var obj = data[key];
					if (obj.date === "all") {
						let table = document.getElementById('tableAll');
						table.innerHTML = mainTable(obj.count, obj.sum,
								obj.min, obj.average, obj.max);
					} else if (obj.date === "year") {
						let table = document.getElementById('collapseOne');
						let newTable = yearTable(obj.count, obj.sum, obj.min,
								obj.average, obj.max, obj.year);
						let newContent = document.createElement('table');
						newContent.innerHTML = newTable;
						table.appendChild(newContent);
					} else {
						let a = document.getElementById('collapse_' + obj.year);
						if (a === null) {
							a = document.createElement('div');
							a.setAttribute("id", "collapse_" + obj.year);
							a.setAttribute("class", "collapse");
							let table = document.getElementById('collapseOne');
							table.appendChild(a);
						}
						let newTable = monthTable(obj.count, obj.sum, obj.min,
								obj.average, obj.max, obj.month);
						let newContent = document.createElement('table');
						newContent.setAttribute("border", "1");
						newContent.innerHTML = newTable;
						a.appendChild(newContent);
					}
				}
			}
		});

		function monthTable(count, sum, min, avg, max, month) {
			var html = '<tbody>';
			html += '<tr>';
			html += '<td>' + month + '</td>';
			html += "<td>" + count + "</td>";
			html += "<td>" + numeral(sum).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(min).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(avg).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(max).format('(0.00 a)') + "</td>";
			html += '<td></td>';
			html += '</tr>';
			html += '</tbody>';

			return html;
		}

		function yearTable(count, sum, min, avg, max, year) {
			var html = '<tbody>';
			html += '<tr>';
			html += '<td>' + year + '</td>';
			html += "<td>" + count + "</td>";
			html += "<td>" + numeral(sum).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(min).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(avg).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(max).format('(0.00 a)') + "</td>";
			html += '<td><button type="button" class="showButton"';
			html += 'onClick="collapseButton(this)" data-target="#collapse_'
					+ year + '">show</button></td>';
			html += '</tr>';
			html += '</tbody>';

			return html;
		}

		function mainTable(count, sum, min, avg, max) {
			var html = "<thead>";
			html += "<tr>";
			html += "<th></th>";
			html += "<th>COUNT</th>";
			html += "<th>SUM</th>";
			html += "<th>MIN</th>";
			html += "<th>AVG</th>";
			html += "<th>MAX</th>";
			html += "<th></th>";
			html += "</tr>";
			html += "</thead>";
			html += "<tbody>";
			html += "<tr>";
			html += "<th>ALL</th>";
			html += "<td>" + count + "</td>";
			html += "<td>" + numeral(sum).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(min).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(avg).format('(0.00 a)') + "</td>";
			html += "<td>" + numeral(max).format('(0.00 a)') + "</td>";
			html += '<td><button type="button" class="showButton" onClick="collapseButton(this)" data-target="#collapseOne">show</button></td>';
			html += "</tr>";
			html += "</tbody>";

			return html;
		}

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