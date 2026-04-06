package com.smarttask.manager.service;

import com.smarttask.manager.model.User;
import com.smarttask.manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public User registerUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if ("admin".equals(user.getUsername()) || "admin".equalsIgnoreCase(user.getRole())) {
            user.setRole("ROLE_ADMIN");
        } else if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("ROLE_USER");
        }
        // For MVP, saving password as plain text. 
        return userRepository.save(user);
    }

    public Optional<User> loginUser(String username, String password) {
        Optional<User> userOptional = userRepository.findByUsername(username);
        if (userOptional.isPresent()) {
            User user = userOptional.get();
            if (user.getPassword().equals(password)) {
                return Optional.of(user);
            }
        }
        return Optional.empty();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
}
