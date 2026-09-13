package com.liferpg.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "shop_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ShopItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(nullable = false)
    private int price; // In Gold

    @Enumerated(EnumType.STRING)
    private ItemType type; // TITLE, AVATAR, BADGE, REAL_REWARD

    private String icon; // Icon name or emoji (e.g. "⚔️", "🍕", "🎮")

    private String rarity; // COMMON, RARE, EPIC, LEGENDARY

    // For custom real-life rewards created by user (null if system default item)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by_user_id")
    private User createdBy;

    public enum ItemType {
        TITLE, AVATAR, BADGE, REAL_REWARD
    }
}