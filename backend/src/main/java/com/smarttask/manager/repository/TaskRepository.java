package com.smarttask.manager.repository;

import com.smarttask.manager.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserId(Long userId);
    List<Task> findByUserIdAndStatus(Long userId, String status);
    List<Task> findByUserIdAndPriority(Long userId, String priority);
    List<Task> findByUserIdAndTitleContainingIgnoreCase(Long userId, String title);
}
