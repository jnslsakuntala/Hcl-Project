package com.smarttask.manager.controller;

import com.smarttask.manager.dto.AuthResponse;
import com.smarttask.manager.dto.LoginRequest;
import com.smarttask.manager.model.User;
import com.smarttask.manager.security.JwtUtil;
import com.smarttask.manager.security.UserDetailsServiceImpl;
import com.smarttask.manager.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        try {
            User savedUser = userService.registerUser(user);
            UserDetails userDetails = userDetailsService.loadUserByUsername(savedUser.getUsername());
            String token = jwtUtil.generateToken(userDetails);
            return ResponseEntity.ok(new AuthResponse(savedUser.getId(), savedUser.getUsername(), savedUser.getName(), "Registration successful", token, savedUser.getRole()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword())
            );
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Invalid username or password");
        }

        UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getUsername());
        String token = jwtUtil.generateToken(userDetails);
        
        Optional<User> userOptional = userService.loginUser(loginRequest.getUsername(), loginRequest.getPassword());
        User user = userOptional.get();

        return ResponseEntity.ok(new AuthResponse(user.getId(), user.getUsername(), user.getName(), "Login successful", token, user.getRole()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserProfile(@PathVariable Long id) {
        Optional<User> userOptional = userService.getUserById(id);
        if (userOptional.isPresent()) {
            return ResponseEntity.ok(userOptional.get());
        }
        return ResponseEntity.notFound().build();
    }
}
