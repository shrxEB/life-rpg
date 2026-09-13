package com.liferpg.repository;

import com.liferpg.model.ActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ActivityLogRepository extends JpaRepository<ActivityLog, Long> {

    // Fetches the latest 20 activity logs sorted by newest first
    List<ActivityLog> findTop20ByOrderByTimestampDesc();
}