package app.web.simple.dto;

public class DescriptiveStatisticsDto {

	public double sum;
	public double min;
	public double max;
	public double average;
	public long count;
	public String year;
	public String month;
	public int monthNumber;
	public String date;

	public double getSum() {
		return sum;
	}

	public void setSum(double sum) {
		this.sum = sum;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public double getMin() {
		return min;
	}

	public void setMin(double min) {
		this.min = min;
	}

	public double getMax() {
		return max;
	}

	public void setMax(double max) {
		this.max = max;
	}

	public double getAverage() {
		return average;
	}

	public void setAverage(double average) {
		this.average = average;
	}

	public long getCount() {
		return count;
	}

	public void setCount(long count) {
		this.count = count;
	}

	public int getMonthNumber() {
		return monthNumber;
	}

	public void setMonthNumber(int monthNumber) {
		this.monthNumber = monthNumber;
	}

}
