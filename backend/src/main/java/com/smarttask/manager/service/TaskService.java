package com.smarttask.manager.service;

import com.smarttask.manager.dto.TaskRequest;
import com.smarttask.manager.model.Task;
import com.smarttask.manager.model.User;
import com.smarttask.manager.repository.TaskRepository;
import com.smarttask.manager.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    public Task createTask(TaskRequest request) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Task task = new Task();
        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus() != null ? request.getStatus() : "Pending");
        task.setPriority(request.getPriority() != null ? request.getPriority() : "Medium");
        task.setDeadline(request.getDeadline());
        task.setUser(user);

        return taskRepository.save(task);
    }

    public List<Task> getAllTasks() {
        return taskRepository.findAll();
    }

    public List<Task> getTasksByUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }

    public List<Task> getTasksByUserAndStatus(Long userId, String status) {
        return taskRepository.findByUserIdAndStatus(userId, status);
    }

    public List<Task> getTasksByUserAndPriority(Long userId, String priority) {
        return taskRepository.findByUserIdAndPriority(userId, priority);
    }

    public List<Task> searchTasksByTitle(Long userId, String title) {
        return taskRepository.findByUserIdAndTitleContainingIgnoreCase(userId, title);
    }

    public Optional<Task> getTaskById(Long taskId) {
        return taskRepository.findById(taskId);
    }

    public Task updateTask(Long taskId, TaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new RuntimeException("Task not found"));

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());
        task.setPriority(request.getPriority());
        task.setDeadline(request.getDeadline());

        return taskRepository.save(task);
    }

    public void deleteTask(Long taskId) {
        taskRepository.deleteById(taskId);
    }
}
