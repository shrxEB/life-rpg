package com.liferpg.service;

import com.liferpg.dto.UserProfileResponse;
import com.liferpg.model.User;
import com.liferpg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final ProgressionService progressionService;

    public UserProfileResponse getUserProfile(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        int reqXp = progressionService.getXpRequiredForNextLevel(user.getLevel());

        // Anti-Cheat Power Score formula:
        // Level*200 + TotalXP + Streak*50 + (Sum of stats)*10
        int powerScore = (user.getLevel() * 200)
                + user.getTotalXp()
                + (user.getStreakDays() * 50)
                + ((user.getStrength() + user.getIntellect() + user.getDiscipline()
                + user.getCreativity() + user.getCharisma()) * 10);

        return UserProfileResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .email(user.getEmail())
                .title(user.getTitle())
                .avatar(user.getAvatar())
                .level(user.getLevel())
                .currentXp(user.getCurrentXp())
                .totalXp(user.getTotalXp())
                .xpRequiredForNextLevel(reqXp)
                .gold(user.getGold())
                .streakDays(user.getStreakDays())
                .mysteryChests(user.getMysteryChests())
                .strength(user.getStrength())
                .intellect(user.getIntellect())
                .discipline(user.getDiscipline())
                .creativity(user.getCreativity())
                .charisma(user.getCharisma())
                .partyName(user.getParty() != null ? user.getParty().getName() : null)
                .partyInviteCode(user.getParty() != null ? user.getParty().getInviteCode() : null)
                .powerScore(powerScore)
                .build();
    }

    public UserProfileResponse updateProfile(String username, String title, String avatar) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        if (title != null && !title.isBlank()) user.setTitle(title);
        if (avatar != null && !avatar.isBlank()) user.setAvatar(avatar);

        userRepository.save(user);
        return getUserProfile(username);
    }
}