package com.liferpg.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AttributeCategory category; // STRENGTH, INTELLECT, DISCIPLINE, CREATIVITY, CHARISMA

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Difficulty difficulty; // EASY, MEDIUM, HARD, EPIC

    private int xpReward;
    private int goldReward;

    @Builder.Default
    private boolean completed = false;

    private LocalDateTime completedAt;
    private LocalDateTime dueDate;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public enum AttributeCategory {
        STRENGTH, INTELLECT, DISCIPLINE, CREATIVITY, CHARISMA
    }

    public enum Difficulty {
        EASY(50, 20),
        MEDIUM(100, 45),
        HARD(200, 100),
        EPIC(400, 250);

        public final int defaultXp;
        public final int defaultGold;

        Difficulty(int xp, int gold) {
            this.defaultXp = xp;
            this.defaultGold = gold;
        }
    }
}