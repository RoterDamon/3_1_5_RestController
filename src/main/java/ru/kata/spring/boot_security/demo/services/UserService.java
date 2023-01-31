package ru.kata.spring.boot_security.demo.services;


import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {
    List<User> allUsers();
    User findUserById(Long id);

    User userByName(String name);

    boolean saveUser(User user);

    boolean updateUser(User user, Long userId);

    boolean deleteUser(Long id);
}
