package app.web.simple.service.impl;

import java.text.DateFormatSymbols;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.DoubleSummaryStatistics;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.web.simple.dao.DescriptiveStatisticsDao;
import app.web.simple.dto.DescriptiveStatisticsDto;
import app.web.simple.service.DescriptiveStatisticsService;

@Service
@Transactional
public class DescriptiveStatisticsServiceImpl implements DescriptiveStatisticsService {

	@Autowired
	DescriptiveStatisticsDao dao;

	@Override
	public List<DescriptiveStatisticsDto> descriptiveStatisticsAllData() {
		List<List<Map<String, Object>>> summarize = dao.summarize();
		List<DescriptiveStatisticsDto> dtos = new ArrayList<DescriptiveStatisticsDto>();
		summarize.forEach(a -> {
			a.forEach(b -> {
				DescriptiveStatisticsDto dto = new DescriptiveStatisticsDto();
				dto.setSum((double) b.get("sum_"));
				dto.setYear(b.get("year_").toString());
				dto.setMonth(b.get("month_").toString());
				dto.setDate(b.get("date_").toString());
				dtos.add(dto);
			});
		});
		Map<String, Map<String, List<DescriptiveStatisticsDto>>> collectMonth = dtos.stream()
				.collect(Collectors.groupingBy(DescriptiveStatisticsDto::getYear,
						Collectors.groupingBy(DescriptiveStatisticsDto::getMonth)));

		List<DescriptiveStatisticsDto> data = new ArrayList<DescriptiveStatisticsDto>();
		collectMonth.entrySet().forEach(a -> {
			String year = a.getKey();
			a.getValue().entrySet().forEach(b -> {
				String month = b.getKey();
				DoubleSummaryStatistics statistics = b.getValue().stream().map(DescriptiveStatisticsDto::getSum)
						.mapToDouble(Double::doubleValue).summaryStatistics();
				DescriptiveStatisticsDto dto = new DescriptiveStatisticsDto();
				dto.setAverage(statistics.getAverage());
				dto.setCount(statistics.getCount());
				dto.setMax(statistics.getMax());
				dto.setMin(statistics.getMin());
				dto.setMonthNumber(Integer.parseInt(month));
				dto.setMonth(getMonthForInt(Integer.parseInt(month) - 1));
				dto.setYear(year);
				dto.setDate("month");
				dto.setSum(statistics.getSum());
				data.add(dto);
			});
		});

		Map<String, List<DescriptiveStatisticsDto>> collectYear = data.stream()
				.collect(Collectors.groupingBy(DescriptiveStatisticsDto::getYear));
		List<DescriptiveStatisticsDto> dataYear = new ArrayList<DescriptiveStatisticsDto>();
		collectYear.entrySet().forEach(a -> {
			DoubleSummaryStatistics statistics = a.getValue().stream().map(DescriptiveStatisticsDto::getSum)
					.mapToDouble(Double::doubleValue).summaryStatistics();
			DescriptiveStatisticsDto dto = new DescriptiveStatisticsDto();
			dto.setAverage(statistics.getAverage());
			dto.setCount(statistics.getCount());
			dto.setMax(statistics.getMax());
			dto.setMin(statistics.getMin());
			dto.setYear(a.getKey());
			dto.setSum(statistics.getSum());
			dto.setDate("year");
			dto.setMonthNumber(0);
			data.add(dto);
			dataYear.add(dto);
		});

		Map<String, List<DescriptiveStatisticsDto>> collectAll = dataYear.stream()
				.collect(Collectors.groupingBy(DescriptiveStatisticsDto::getDate));
		collectAll.entrySet().forEach(a -> {
			DoubleSummaryStatistics statistics = a.getValue().stream().map(DescriptiveStatisticsDto::getSum)
					.mapToDouble(Double::doubleValue).summaryStatistics();
			DescriptiveStatisticsDto dto = new DescriptiveStatisticsDto();
			dto.setAverage(statistics.getAverage());
			dto.setCount(statistics.getCount());
			dto.setMax(statistics.getMax());
			dto.setMin(statistics.getMin());
			dto.setYear(a.getKey());
			dto.setSum(statistics.getSum());
			dto.setMonthNumber(0);
			dto.setDate("all");
			data.add(dto);
		});

		return data.stream().sorted(Comparator.comparing(DescriptiveStatisticsDto::getYear)
				.thenComparing(DescriptiveStatisticsDto::getMonthNumber)).collect(Collectors.toList());

	}

	private String getMonthForInt(int num) {
		String month = "wrong";
		DateFormatSymbols dfs = new DateFormatSymbols();
		String[] months = dfs.getMonths();
		if (num >= 0 && num <= 11) {
			month = months[num];
		}
		return month;
	}

}
