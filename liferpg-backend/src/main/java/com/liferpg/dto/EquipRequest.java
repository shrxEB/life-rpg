package com.liferpg.dto;

import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class EquipRequest {

    @NotNull(message = "Inventory ID is required")
    private Long inventoryId;
}