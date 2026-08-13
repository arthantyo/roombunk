package staycay.services;

import java.util.List;

import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;
import staycay.models.Task;
import staycay.repositories.TaskRepository;

@Service
@RequiredArgsConstructor
public class TaskService {
    private final TaskRepository taskRepository;
    
    public Task createNewTask(Task task) {
        return taskRepository.save(task);
    }
    
    public List<Task> getAllTask() {
        return taskRepository.findAll();
    }
    
    public Task findTaskById(Long id) {
        return taskRepository.findById(id).orElse(null);
    }
    
    public List<Task> findAllCompletedTask() {
        return taskRepository.findByCompletedTrue();
    }
    
    public List<Task> findAllInCompleteTask() {
        return taskRepository.findByCompletedFalse();
    }
    
    public void deleteTask(Task task) {
        taskRepository.delete(task);
    }
    
    public Task updateTask(Task task) {
        return taskRepository.save(task);
    }
}
