package staycay.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import staycay.models.Task;
import staycay.services.TaskService;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {
    
    @Autowired
    private TaskService taskService;
    
    @GetMapping("/")
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTask());
    }

    @GetMapping("/completed")
    public ResponseEntity<List<Task>> getCompletedTasks() {
        return ResponseEntity.ok(taskService.findAllCompletedTask());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        Task task = taskService.findTaskById(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(task);
    }

    @GetMapping("/incomplete")
    public ResponseEntity<List<Task>> getIncompleteTasks() {
        return ResponseEntity.ok(taskService.findAllInCompleteTask());
    }

    @PostMapping("/")
    public ResponseEntity<Task> createTask(@RequestBody Task task) {
        return ResponseEntity.ok(taskService.createNewTask(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        task.setId(id);
        return ResponseEntity.ok(taskService.updateTask(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Boolean> deleteTask(@PathVariable Long id) {
        Task task = taskService.findTaskById(id);
        if (task == null) {
            return ResponseEntity.notFound().build();
        }
        taskService.deleteTask(task);
        return ResponseEntity.ok(true);
    }
}
