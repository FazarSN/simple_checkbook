package app.web.simple.controller;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.web.simple.service.CheckBookService;

@RestController
public class DescriptiveStatistics {

	@Autowired
	private CheckBookService checkBookService;

	@RequestMapping(value = "/descriptive/everything", method = RequestMethod.GET)
	public JSONObject tableCheckBookData() {
		try {
			
		} catch (Exception e) {
			System.out.println("error showing data");
			e.printStackTrace();
		}
		JSONObject result = new JSONObject();
		result.put("data", checkBookService.findAll());
		return result;
	}

}
