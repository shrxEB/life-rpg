package com.liferpg.service;

import com.liferpg.dto.LeaderboardEntry;
import com.liferpg.model.User;
import com.liferpg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final UserRepository userRepository;

    public List<LeaderboardEntry> getGlobalLeaderboard() {
        List<User> users = userRepository.findTop50ByOrderByTotalXpDesc();
        return mapToLeaderboardEntries(users);
    }

    public List<LeaderboardEntry> mapToLeaderboardEntries(List<User> users) {
        List<LeaderboardEntry> entries = new ArrayList<>();
        int rank = 1;

        for (User user : users) {
            int powerScore = (user.getLevel() * 200)
                    + user.getTotalXp()
                    + (user.getStreakDays() * 50)
                    + ((user.getStrength() + user.getIntellect() + user.getDiscipline()
                    + user.getCreativity() + user.getCharisma()) * 10);

            entries.add(LeaderboardEntry.builder()
                    .rank(rank++)
                    .userId(user.getId())
                    .username(user.getUsername())
                    .title(user.getTitle())
                    .avatar(user.getAvatar())
                    .level(user.getLevel())
                    .totalXp(user.getTotalXp())
                    .streakDays(user.getStreakDays())
                    .powerScore(powerScore)
                    .partyName(user.getParty() != null ? user.getParty().getName() : null)
                    .build());
        }
        return entries;
    }
}