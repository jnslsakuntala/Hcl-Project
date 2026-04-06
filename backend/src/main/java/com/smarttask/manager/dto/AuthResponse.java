package com.smarttask.manager.dto;

public class AuthResponse {
    private Long id;
    private String username;
    private String name;
    private String message;
    private String token;
    private String role;

    public AuthResponse(Long id, String username, String name, String message, String token, String role) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.message = message;
        this.token = token;
        this.role = role;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
