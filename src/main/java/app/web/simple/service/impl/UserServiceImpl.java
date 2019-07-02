package app.web.simple.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import app.web.simple.dao.UserDao;
import app.web.simple.entity.User;
import app.web.simple.service.UserService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

	@Autowired
	private UserDao userDao;

	@Override
	public User persist(User user) {
		User exists = userDao.findByName(user.getName());
		if (exists == null) {
			user = userDao.save(user);
			user.setDataSaved(true);
		} else {
			user.setDataSaved(false);
		}
		return user;
	}

	@Override
	public List<User> findAllUsers() {
		return userDao.findAll();
	}

	@Override
	public User getById(Long id) {
		return userDao.findById(id).orElse(null);
	}

	@Override
	public boolean deleteById(Long id) {
		try {
			userDao.deleteById(id);
			return true;
		} catch (Exception e) {
			return false;
		}
	}

}
