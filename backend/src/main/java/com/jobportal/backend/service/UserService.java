package com.jobportal.backend.service;

import com.jobportal.backend.entity.User;
import java.util.List;

public interface UserService {
    User registerUser(User user);
    List<User> getAllUsers();
}
