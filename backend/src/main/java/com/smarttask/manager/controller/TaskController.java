package com.smarttask.manager.controller;

import com.smarttask.manager.dto.TaskRequest;
import com.smarttask.manager.model.Task;
import com.smarttask.manager.service.TaskService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    @Autowired
    private TaskService taskService;

    @PostMapping
    public ResponseEntity<?> createTask(@RequestBody TaskRequest request) {
        try {
            Task task = taskService.createTask(request);
            return ResponseEntity.ok(task);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/all")
    public ResponseEntity<?> getAllTasksForAdmin() {
        try {
            List<Task> tasks = taskService.getAllTasks();
            return ResponseEntity.ok(tasks);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Task>> getAllTasks(@PathVariable Long userId,
                                                    @RequestParam(required = false) String status,
                                                    @RequestParam(required = false) String priority,
                                                    @RequestParam(required = false) String search) {
        List<Task> tasks;
        if (search != null && !search.isEmpty()) {
            tasks = taskService.searchTasksByTitle(userId, search);
        } else if (status != null && !status.isEmpty()) {
            tasks = taskService.getTasksByUserAndStatus(userId, status);
        } else if (priority != null && !priority.isEmpty()) {
            tasks = taskService.getTasksByUserAndPriority(userId, priority);
        } else {
            tasks = taskService.getTasksByUser(userId);
        }
        return ResponseEntity.ok(tasks);
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<?> getTaskById(@PathVariable Long taskId) {
        return taskService.getTaskById(taskId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{taskId}")
    public ResponseEntity<?> updateTask(@PathVariable Long taskId, @RequestBody TaskRequest request) {
        try {
            Task updatedTask = taskService.updateTask(taskId, request);
            return ResponseEntity.ok(updatedTask);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{taskId}")
    public ResponseEntity<?> deleteTask(@PathVariable Long taskId) {
        try {
            taskService.deleteTask(taskId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
