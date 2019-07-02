package app.web.simple.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import app.web.simple.service.UserService;

@Controller
public class Page {

	@Autowired
	private UserService userService;

	@RequestMapping("/user")
	public String User() {
		return "user-management";
	}

	@RequestMapping("/user/add")
	public String addUser(ModelMap model, @RequestParam(required = false) Long id,
			@RequestParam(required = false) String name) {
		model.put("id", id);
		model.put("name", name);
		return "add-user";
	}

	@RequestMapping("/user/delete")
	public String deleteUser(@RequestParam(required = false) Long id) {
		boolean deleted = userService.deleteById(id);
		if (deleted) {
			System.out.println("delete berhasil");
			return "redirect:" + "/user";
		} else {
			System.out.println("delete gagal");
			return "redirect:" + "/home";
		}
	}

	@RequestMapping("/checkbook")
	public String checkBook() {
		return "checkbook-management";
	}

	@RequestMapping("/checkbook/upload")
	public String uploadCheckbook(ModelMap model) {
		model.put("users", userService.findAllUsers());
		return "upload-checkbook";
	}

	@RequestMapping("/checkbook/delete")
	public String deleteCheckbook(ModelMap model) {
		model.put("users", userService.findAllUsers());
		return "delete-checkbook";
	}

}
