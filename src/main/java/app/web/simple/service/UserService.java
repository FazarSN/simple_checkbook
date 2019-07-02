package app.web.simple.service;

import java.util.List;

import app.web.simple.entity.User;

public interface UserService {

	public User persist(User user);

	public List<User> findAllUsers();

	public User getById(Long id);

	public boolean deleteById(Long id);
}
