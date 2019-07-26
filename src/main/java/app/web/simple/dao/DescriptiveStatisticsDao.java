package app.web.simple.dao;

import java.util.List;
import java.util.Map;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import app.web.simple.entity.CheckBook;

public interface DescriptiveStatisticsDao extends JpaRepository<CheckBook, Long> {

	@Query("SELECT SUM(amount) AS sum_,  DAY(c.occurringDate) AS date_, MONTH(c.occurringDate) AS month_, YEAR(c.occurringDate) AS year_\r\n"
			+ "FROM CheckBook c WHERE c.type = 'expense'\r\n"
			+ "GROUP BY MONTH(c.occurringDate), YEAR(c.occurringDate), DAY(c.occurringDate)")
	public List<List<Map<String, Object>>> summarize();

}
