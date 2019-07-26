package app.web.simple.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import app.web.simple.entity.CheckBook;

public interface CheckBookDao extends JpaRepository<CheckBook, Long> {

	@Query("select c from CheckBook c \r\n" + "where c.user.id = :userId and month(c.occurringDate) = :month \r\n"
			+ "and year(c.occurringDate) = :year")
	public List<CheckBook> findByUserMonthYear(@Param("userId") Long userId, @Param("month") Integer month,
			@Param("year") Integer year);

	public void deleteByUser_Id(Long userId);

}
