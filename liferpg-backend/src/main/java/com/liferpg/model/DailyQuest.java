package com.liferpg.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "daily_quests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Task.AttributeCategory category;

    @Builder.Default
    private int currentStreak = 0;

    private LocalDate lastCompletedDate;

    // Track S M T W T F S for the current week
    @Builder.Default
    private boolean sunday = false;
    @Builder.Default
    private boolean monday = false;
    @Builder.Default
    private boolean tuesday = false;
    @Builder.Default
    private boolean wednesday = false;
    @Builder.Default
    private boolean thursday = false;
    @Builder.Default
    private boolean friday = false;
    @Builder.Default
    private boolean saturday = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}
