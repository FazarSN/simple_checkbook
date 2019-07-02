<!DOCTYPE html>
<html>
<head>
<title>User</title>
<link rel="stylesheet" type="text/css"
	href="DataTables/DataTables-1.10.18/css/jquery.dataTables.min.css" />
<link rel="stylesheet" type="text/css" href="css/simple.css" />

</head>
<body>
	<script src="jquery/jquery-3.4.1.min.js"></script>
	<script type="text/javascript"
		src="DataTables/DataTables-1.10.18/js/jquery.dataTables.min.js"></script>
	<h1>User Management</h1>
	<div style="margin-bottom: 2em;">
		<a href="/user/add"><button>Add User</button></a>
	</div>
	<table class="display" id="user-table" style="width: 50%;">
		<thead>
			<tr>
				<th>Id</th>
				<th>Name</th>
				<th>action</th>
			</tr>
		</thead>
	</table>
	<div style="margin-top: 2em;">
		<a href="/">
			<button class="block">back</button>
		</a>
	</div>

	<script>
		var userTable = $('#user-table').DataTable(
				{
					"responsive" : true,
					"ajax" : "/user/data",
					"columns" : [ {
						"data" : "id"
					}, {
						"data" : "name"
					}, {
						"data" : null
					} ],
					"columnDefs" : [ {
						"targets" : -1,
						"data" : null,
						"defaultContent" : "<button id='edit'>edit</button>"
								+ " <button id='delete'>delete</button>"
					} ]
				});

		$('#user-table tbody').on('click', '#edit', function() {
			var data = userTable.row($(this).parents('tr')).data();
			var link = '/user/add';
			link += '?id=' + data["id"];
			link += '&name=' + data["name"]
			window.location = link;
		});

		$('#user-table tbody').on('click', '#delete', function() {
			var data = userTable.row($(this).parents('tr')).data();
			var link = '/user/delete';
			link += '?id=' + data["id"];
			window.location = link;
		});
	</script>
</body>
</html>