package com.liferpg.controller;

import com.liferpg.dto.PartyCreateRequest;
import com.liferpg.dto.PartyJoinRequest;
import com.liferpg.dto.PartyResponse;
import com.liferpg.service.PartyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/parties")
@RequiredArgsConstructor
public class PartyController {

    private final PartyService partyService;

    @PostMapping("/create")
    public ResponseEntity<PartyResponse> createParty(
            @Valid @RequestBody PartyCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(partyService.createParty(request, userDetails.getUsername()));
    }

    @PostMapping("/join")
    public ResponseEntity<PartyResponse> joinParty(
            @Valid @RequestBody PartyJoinRequest request,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        return ResponseEntity.ok(partyService.joinParty(request, userDetails.getUsername()));
    }

    @GetMapping("/my-party")
    public ResponseEntity<PartyResponse> getMyParty(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(partyService.getMyParty(userDetails.getUsername()));
    }

    @PostMapping("/leave")
    public ResponseEntity<Void> leaveParty(@AuthenticationPrincipal UserDetails userDetails) {
        partyService.leaveParty(userDetails.getUsername());
        return ResponseEntity.ok().build();
    }
}