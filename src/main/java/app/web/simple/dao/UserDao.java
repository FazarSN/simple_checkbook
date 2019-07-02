package app.web.simple.dao;

import org.springframework.data.jpa.repository.JpaRepository;

import app.web.simple.entity.User;

public interface UserDao extends JpaRepository<User, Long> {

	User findByName(String name);

}
