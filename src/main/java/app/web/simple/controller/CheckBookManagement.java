package app.web.simple.controller;

import java.util.List;

import javax.servlet.http.HttpServletResponse;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import app.web.simple.entity.User;
import app.web.simple.service.CheckBookService;
import app.web.simple.service.UserService;
import app.web.simple.util.CheckBookUploadDto;
import app.web.simple.util.CsvUtils;

@RestController
public class CheckBookManagement {

	@Autowired
	private CheckBookService checkBookService;

	@Autowired
	private UserService userService;

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/checkbook/data", method = RequestMethod.GET)
	public JSONObject tableCheckBookData() {
		JSONObject result = new JSONObject();
		result.put("data", checkBookService.findAll());
		return result;
	}

	@PostMapping(value = "/checkbook/upload/data", consumes = "multipart/form-data")
	public void uploadCheckBook(HttpServletResponse response, @RequestParam Long userId,
			@RequestParam("file") MultipartFile file) {
		try {
			List<CheckBookUploadDto> data = CsvUtils.read(CheckBookUploadDto.class, file.getInputStream());
			User user = userService.getById(userId);
			data.forEach(item -> item.setUser(user));
			checkBookService.saveFromUpload(data);
			System.out.println("upload berhasil");
			response.sendRedirect("/checkbook");
		} catch (Exception e) {
			System.out.println("error upload");
		}
	}

	@PostMapping(value = "/checkbook/delete/data")
	public void deleteCheckBook(HttpServletResponse response, @RequestParam Integer month, @RequestParam Integer year,
			@RequestParam Long userId) {
		try {
			checkBookService.deleteInBulk(userId, month, year);
			response.sendRedirect("/checkbook");
		} catch (Exception e) {
			System.out.println("error delete");
		}
	}

	@PostMapping(value = "/checkbook/delete/all")
	public void deleteAllCheckBook(HttpServletResponse response, @RequestParam Long userId,
			@RequestParam String password) {
		try {
			checkBookService.deleteInBulk(userId, password);
			response.sendRedirect("/checkbook");
		} catch (Exception e) {
			System.out.println("error delete");
			e.printStackTrace();
		}
	}

}
