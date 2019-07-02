package app.web.simple.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import app.web.simple.entity.CheckBook;

public interface CheckBookDao extends JpaRepository<CheckBook, Long> {

	@Query("select c from CheckBook c where c.user.id = ?1 and month(c.occurringDate) = ?2 and year(c.occurringDate) = ?3")
	public List<CheckBook> findByUserMonthYear(Long userId, Integer month, Integer year);

	public void deleteByUser_Id(Long userId);

}
