package com.jobportal.backend.service;

import com.jobportal.backend.dto.LoginRequest;
import com.jobportal.backend.dto.RegisterRequest;

public interface UserService {

    String register(RegisterRequest request);

    String login(LoginRequest request);
}
