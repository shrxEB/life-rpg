package com.liferpg.config;

import com.liferpg.model.ShopItem;
import com.liferpg.repository.ShopItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final ShopItemRepository shopItemRepository;

    @Override
    public void run(String... args) {
        if (shopItemRepository.count() == 0) {
            shopItemRepository.saveAll(List.of(
                    ShopItem.builder()
                            .name("Shadow Coder")
                            .description("For those who conquer algorithms in the dark.")
                            .price(250)
                            .type(ShopItem.ItemType.TITLE)
                            .icon("💻")
                            .rarity("RARE")
                            .build(),
                    ShopItem.builder()
                            .name("Iron Titan")
                            .description("Unstoppable discipline and physical power.")
                            .price(350)
                            .type(ShopItem.ItemType.TITLE)
                            .icon("🏋️")
                            .rarity("RARE")
                            .build(),
                    ShopItem.builder()
                            .name("Grandmaster")
                            .description("Master of body, mind, and code.")
                            .price(800)
                            .type(ShopItem.ItemType.TITLE)
                            .icon("👑")
                            .rarity("EPIC")
                            .build(),
                    ShopItem.builder()
                            .name("Cyberpunk Neon Avatar")
                            .description("Futuristic glowing character portrait.")
                            .price(400)
                            .type(ShopItem.ItemType.AVATAR)
                            .icon("🤖")
                            .rarity("RARE")
                            .build()
            ));
        }
    }
}