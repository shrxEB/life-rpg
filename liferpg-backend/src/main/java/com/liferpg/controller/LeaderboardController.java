package com.liferpg.controller;

import com.liferpg.dto.LeaderboardEntry;
import com.liferpg.model.ActivityLog;
import com.liferpg.repository.ActivityLogRepository;
import com.liferpg.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaderboard")
@RequiredArgsConstructor
public class LeaderboardController {

    private final LeaderboardService leaderboardService;
    private final ActivityLogRepository activityLogRepository;

    // Public endpoint: World Hall of Fame
    @GetMapping("/global")
    public ResponseEntity<List<LeaderboardEntry>> getGlobalLeaderboard() {
        return ResponseEntity.ok(leaderboardService.getGlobalLeaderboard());
    }

    // Public endpoint: Live Activity Ticker (Latest 20 triumphs across the world)
    @GetMapping("/activity")
    public ResponseEntity<List<ActivityLog>> getLiveActivity() {
        return ResponseEntity.ok(activityLogRepository.findTop20ByOrderByTimestampDesc());
    }
}