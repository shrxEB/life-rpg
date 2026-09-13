package com.liferpg.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    // --- Progression ---
    @Builder.Default
    private int level = 1;

    @Builder.Default
    private int currentXp = 0;

    @Builder.Default
    private int totalXp = 0;

    @Builder.Default
    private int gold = 100;

    @Builder.Default
    private int streakDays = 0;

    private LocalDate lastActiveDate;

    // --- Character Attributes ---
    @Builder.Default
    private int strength = 10;     // Workouts, physical tasks

    @Builder.Default
    private int intellect = 10;    // Coding, reading, study

    @Builder.Default
    private int discipline = 10;   // Waking up early, meditation, consistency

    @Builder.Default
    private int creativity = 10;   // Writing, art, new hobbies

    @Builder.Default
    private int charisma = 10;     // Socializing, presentations, teamwork

    // --- Rewards ---
    @Builder.Default
    private int mysteryChests = 1; // Start with 1 starter chest!

    // --- Social / Guild ---
    @ManyToOne
    @JoinColumn(name = "party_id")
    private Party party;

    @Builder.Default
    private String title = "Novice Adventurer";

    @Builder.Default
    private String avatar = "warrior_default";
}