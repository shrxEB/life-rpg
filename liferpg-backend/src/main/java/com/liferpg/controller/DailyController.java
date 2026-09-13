package com.liferpg.controller;

import com.liferpg.dto.DailyQuestRequest;
import com.liferpg.dto.DailyQuestResponse;
import com.liferpg.dto.QuestCompletionResult;
import com.liferpg.service.DailyQuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dailies")
@RequiredArgsConstructor
public class DailyController {

    private final DailyQuestService dailyQuestService;

    @GetMapping
    public ResponseEntity<List<DailyQuestResponse>> getMyDailies(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(dailyQuestService.getMyDailies(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<DailyQuestResponse> createDaily(
            @Valid @RequestBody DailyQuestRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(dailyQuestService.createDaily(request, userDetails.getUsername()));
    }

    @PostMapping("/{id}/check")
    public ResponseEntity<QuestCompletionResult> checkInDaily(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(dailyQuestService.checkInDaily(id, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDaily(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        dailyQuestService.deleteDaily(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}