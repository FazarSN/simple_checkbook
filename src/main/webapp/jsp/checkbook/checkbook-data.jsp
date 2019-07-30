<!DOCTYPE html>
<html>
<head>
<title>CheckBook</title>
<link rel="stylesheet" type="text/css"
	href="${request.contextPath}/DataTables/DataTables-1.10.18/css/jquery.dataTables.min.css" />
<link rel="stylesheet" type="text/css"
	href="${request.contextPath}/css/simple.css" />
</head>
<body>
	<script src="${request.contextPath}/jquery/jquery-3.4.1.min.js"></script>
	<script type="text/javascript"
		src="${request.contextPath}/DataTables/DataTables-1.10.18/js/jquery.dataTables.min.js"></script>
	<script type="text/javascript"
		src="${request.contextPath}/DataTables/DateTime/moment.min.js"></script>
	<h1>CheckBook</h1>
	<div style="margin-bottom: 2em;">
		<a href="/checkbook/upload"><button>Upload Data</button></a> <br>
		<br> <a href="/checkbook/delete"><button>Delete in
				Bulk</button></a>
	</div>
	<table class="display" id="checkbook-table" style="width: 50%;">
		<thead>
			<tr>
				<th>User</th>
				<th>Date</th>
				<th>Type</th>
				<th>Category</th>
				<th>Purpose</th>
				<th>Amount</th>
			</tr>
		</thead>
		<tfoot>
			<tr>
				<th>User</th>
				<th>Date</th>
				<th>Type</th>
				<th>Category</th>
				<th>Purpose</th>
				<th>Amount</th>
			</tr>
		</tfoot>
	</table>
	<div style="margin-top: 2em;">
		<a href="/checkbook">
			<button class="block">back</button>
		</a>
	</div>

	<script>
		$('#checkbook-table').DataTable({
			"ajax" : "/checkbook/data",
			"columns" : [ {
				"data" : "user.name"
			}, {
				"data" : "occurringDate",
				"render" : function(data) {
					return moment(data).format('MMMM Do YYYY');
				}
			}, {
				"data" : "type"
			}, {
				"data" : "category1",
				"render" : function(data, type, row) {
					if (row) {
						if (row["category2"]) {
							return data + " : " + row["category2"];
						} else {
							return data;
						}
					} else {
						return data;
					}
				}
			}, {
				"data" : "purpose"
			}, {
				"data" : "amount"
			} ],
			"initComplete" : function() {
				var api = this.api();
				var settings = this.fnSettings();
				api.columns().indexes().flatten().each(function(i) {
					var renderFunction = settings.aoColumns[i]["mRender"];
					var column = api.column(i);
					var select = $('<select><option value=""></option></select>')
					.appendTo($(column.footer()).empty()).on('change', function() {
						var val = $.fn.dataTable.util.escapeRegex($(this).val());
						column.search(val ? '^' + val + '$' : '', true, false).draw();
					});

					column.data().unique().sort().each(function(d, j) {
						if (renderFunction == null) {
							select.append('<option value="' + d + '">' + d + '</option>');
						} else {
							console.log(d);
							select.append('<option value="' + renderFunction(d, 'display', null) + '">'
									+ renderFunction(d, 'display', null) + '</option>');
						}
					});
				});
			}
		});
	</script>
</body>
</html>