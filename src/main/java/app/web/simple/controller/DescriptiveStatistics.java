package app.web.simple.controller;

import org.json.simple.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import app.web.simple.service.DescriptiveStatisticsService;

@RestController
public class DescriptiveStatistics {

	@Autowired
	private DescriptiveStatisticsService descriptiveStatisticsService;

	@SuppressWarnings("unchecked")
	@RequestMapping(value = "/descriptive/everything", method = RequestMethod.GET)
	public JSONObject tableCheckBookData() {
		JSONObject result = new JSONObject();
		try {
			result.put("data", descriptiveStatisticsService.descriptiveStatisticsAllData());
		} catch (Exception e) {
			System.out.println("error showing data");
			e.printStackTrace();
		}
		return result;
	}

}
