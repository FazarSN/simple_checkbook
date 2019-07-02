<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<title>CheckBook</title>
<link rel="stylesheet" type="text/css"
	href="${request.contextPath}/css/simple.css" />
</head>
<body>
	<form action="/checkbook/upload/data" method="post"
		enctype="multipart/form-data">
		<select name='userId' required>
			<c:forEach items="${users}" var="i">
				<option value="${i.id}">${i.name}</option>
			</c:forEach>
		</select> <input type="file" name="file" id="file" /> <input type="submit"
			name="submit" value="Submit" />
	</form>
	<div style="margin-top: 2em;">
		<a href="/checkbook">
			<button class="block">back</button>
		</a>
	</div>
</body>
</html>