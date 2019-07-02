package app.web.simple.controller;

import java.util.Date;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import app.web.simple.entity.User;
import app.web.simple.service.UserService;

@RestController
public class UserManagement {

	@Autowired
	private UserService userService;

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/user/data", method = RequestMethod.GET)
	public JSONObject tableUserData() {
		JSONObject result = new JSONObject();
		result.put("data", userService.findAllUsers());
		return result;
	}

	@RequestMapping(value = "/user/save", method = RequestMethod.POST)
	public String saveUser(@RequestParam String name, @RequestParam(required = false) Long id) {
		User user = new User();
		if (id == null) {
			System.out.println("saving data");
			user.setCreatedDate(new Date());
		} else {
			System.out.println("updating data");
			User old = userService.getById(id);
			user.setCreatedDate(old.getCreatedDate());
			user.setId(old.getId());
			user.setModifiedDate(new Date());
		}
		user.setName(name);
		user = userService.persist(user);
		if (user.isDataSaved()) {
			return "berhasil";
		} else {
			throw new ResponseStatusException(HttpStatus.CONFLICT, "name already exist");
		}
	}

}
