package com.trafficflow.service;

import com.trafficflow.dto.UserDto;
import com.trafficflow.entity.User;
import com.trafficflow.exception.BadRequestException;
import com.trafficflow.exception.ResourceNotFoundException;
import com.trafficflow.repository.TrafficRecordRepository;
import com.trafficflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final TrafficRecordRepository trafficRecordRepository;

    public AdminService(UserRepository userRepository, TrafficRecordRepository trafficRecordRepository) {
        this.userRepository = userRepository;
        this.trafficRecordRepository = trafficRecordRepository;
    }

    @Transactional(readOnly = true)
    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserDto(
                        u.getId(),
                        u.getUsername(),
                        u.getEmail(),
                        u.getFullName(),
                        u.getRole(),
                        u.getCreatedAt()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public void deleteUser(Long id, String currentAdminUsername) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        if (user.getUsername().equalsIgnoreCase(currentAdminUsername)) {
            throw new BadRequestException("Administrator cannot delete their own active account.");
        }

        if ("admin".equalsIgnoreCase(user.getUsername())) {
            throw new BadRequestException("Default system administrator account cannot be deleted.");
        }

        userRepository.delete(user);
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAdminStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalRecords", trafficRecordRepository.count());
        stats.put("highTrafficIncidents", trafficRecordRepository.countByPredictedTrafficLevel("HIGH TRAFFIC"));
        return stats;
    }
}
