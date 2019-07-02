package app.web.simple.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.web.simple.constant.Constant;
import app.web.simple.dao.CheckBookDao;
import app.web.simple.entity.CheckBook;
import app.web.simple.service.CheckBookService;
import app.web.simple.util.CheckBookUploadDto;

@Service
@Transactional
public class CheckBookServiceImpl implements CheckBookService {

	@Autowired
	private CheckBookDao checkBookDao;

	@Override
	public List<CheckBook> findAll() {
		return checkBookDao.findAll();
	}

	@Override
	public void saveFromUpload(List<CheckBookUploadDto> dtos) {
		try {
			dtos.stream().map(CheckBook::map).forEach(c -> checkBookDao.save(c));
		} catch (Exception e) {
			e.printStackTrace();
		}
	}

	@Override
	public void deleteInBulk(Long userId, int month, int year) {
		List<CheckBook> user = checkBookDao.findByUserMonthYear(userId, month, year);
		checkBookDao.deleteAll(user);
	}

	@Override
	public void deleteInBulk(Long userId, String password) throws Exception {
		if (Constant.DELETE_ALL_PASSWORD.equals(password)) {
			checkBookDao.deleteByUser_Id(userId);
		} else {
			throw new Exception("wrong password");
		}
	}

}