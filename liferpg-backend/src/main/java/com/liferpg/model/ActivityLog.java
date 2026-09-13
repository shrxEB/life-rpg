package com.liferpg.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "activity_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActivityLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String action; // e.g., "completed 'Morning 5km Run'" or "reached Level 5!"
    private int xpGained;

    @Builder.Default
    private LocalDateTime timestamp = LocalDateTime.now();
}