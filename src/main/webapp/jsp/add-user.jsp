<!DOCTYPE html>
<html>
<head>
<title>User</title>
<link rel="stylesheet" type="text/css"
	href="${request.contextPath}/css/simple.css" />
</head>
<body>
	<script src="${request.contextPath}/jquery/jquery-3.4.1.min.js"></script>
	<form action="/user/save" id="form" method="post">
		<input type="hidden" name="id" value="${id}" /> name : <input
			type="text" name="name" value="${name}">
		<button type="button" id="btnSave">save</button>
	</form>
	<div style="margin-top: 2em;">
		<a href="/user">
			<button class="block">back</button>
		</a>
	</div>
	<script>
		$('#btnSave').click(function() {
			$.ajax({
				url : $('#form').attr('action'),
				type : 'POST',
				data : $('#form').serialize(),
				success : function() {
					window.location = "/user"
				},
				error : function(data) {
					alert(data.responseJSON.message);
				}
			});
			return false;
		});
	</script>
</body>
</html>