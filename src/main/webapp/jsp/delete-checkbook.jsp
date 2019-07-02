<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html>
<html>
<head>
<title>CheckBook</title>
<link rel="stylesheet" type="text/css"
	href="${request.contextPath}/css/simple.css" />
<link rel="stylesheet" type="text/css"
	href="${request.contextPath}/css/tab.css" />
</head>
<body>
	<div class="tab">
		<button class="tablinks" onclick="openTab(event, 'byDate')">date</button>
		<button class="tablinks" onclick="openTab(event, 'byAll')">all</button>
	</div>
	<div id="byDate" class="tabcontent">
		<form action="/checkbook/delete/data" method="post">
			user : <select name='userId' required>
				<c:forEach items="${users}" var="i">
					<option value="${i.id}">${i.name}</option>
				</c:forEach>
			</select><br> month : <select name="month"><option value="1">1
					- January</option>
				<option value="2">2 - February</option>
				<option value="3">3- March</option>
				<option value="4">4- April</option>
				<option value="5">5 - May</option>
				<option value="6">6 - June</option>
				<option value="7">7 - July</option>
				<option value="8">8 - August</option>
				<option value="9">9 - September</option>
				<option value="10">10 - October</option>
				<option value="11">11 - November</option>
				<option value="12">12 - December</option></select> <br> year : <select
				name="year"><option value="2018">2018</option>
				<option value="2019">2019</option>
				<option value="2020">2020</option></select> <br>
			<button type="submit" style="margin-top: 2em;">delete in
				bulk</button>
		</form>
	</div>
	<div id="byAll" class="tabcontent">
		<form action="/checkbook/delete/all" method="post">
			<p>DANGER : THIS WILL DELETE ALL DATA</p>
			user : <select name='userId' required>
				<c:forEach items="${users}" var="i">
					<option value="${i.id}">${i.name}</option>
				</c:forEach>
			</select><br> password : <input type="text" name="password" /> <br>
			<button type="submit" style="margin-top: 2em;">delete in
				bulk</button>
		</form>
	</div>
	<div style="margin-top: 2em;">
		<a href="/checkbook">
			<button class="block">back</button>
		</a>
	</div>
	<script>
		function openTab(evt, tabId) {
			// Declare all variables
			var i, tabcontent, tablinks;

			// Get all elements with class="tabcontent" and hide them
			tabcontent = document.getElementsByClassName("tabcontent");
			for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
			}

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = document.getElementsByClassName("tablinks");
			for (i = 0; i < tablinks.length; i++) {
				tablinks[i].className = tablinks[i].className.replace(
						" active", "");
			}

			// Show the current tab, and add an "active" class to the button that opened the tab
			document.getElementById(tabId).style.display = "block";
			evt.currentTarget.className += " active";
		}
	</script>
</body>
</html>