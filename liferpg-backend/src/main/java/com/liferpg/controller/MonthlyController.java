package com.liferpg.controller;

import com.liferpg.dto.MonthlyProgressRequest;
import com.liferpg.dto.MonthlyQuestRequest;
import com.liferpg.dto.QuestCompletionResult;
import com.liferpg.model.MonthlyQuest;
import com.liferpg.service.MonthlyQuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/monthlies")
@RequiredArgsConstructor
public class MonthlyController {

    private final MonthlyQuestService monthlyQuestService;

    @GetMapping
    public ResponseEntity<List<MonthlyQuest>> getMyMonthlyQuests(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(monthlyQuestService.getMyMonthlyQuests(userDetails.getUsername()));
    }

    @PostMapping
    public ResponseEntity<MonthlyQuest> createMonthlyQuest(
            @Valid @RequestBody MonthlyQuestRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(monthlyQuestService.createMonthlyQuest(request, userDetails.getUsername()));
    }

    @PostMapping("/{id}/progress")
    public ResponseEntity<QuestCompletionResult> recordProgress(
            @PathVariable Long id,
            @Valid @RequestBody MonthlyProgressRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(monthlyQuestService.recordProgress(id, request, userDetails.getUsername()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMonthlyQuest(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        monthlyQuestService.deleteMonthlyQuest(id, userDetails.getUsername());
        return ResponseEntity.noContent().build();
    }
}