package com.liferpg.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "monthly_quests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MonthlyQuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    private Task.AttributeCategory category;

    private int targetValue;     // e.g. 30 (days) or 11 (pull-ups)

    @Builder.Default
    private int currentValue = 0; // e.g. 18/30

    private int xpReward;
    private int goldReward;

    @Builder.Default
    private boolean completed = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;
}