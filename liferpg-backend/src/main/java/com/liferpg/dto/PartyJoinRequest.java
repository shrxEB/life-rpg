package com.liferpg.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PartyJoinRequest {

    @NotBlank(message = "Invite code is required")
    private String inviteCode;
}