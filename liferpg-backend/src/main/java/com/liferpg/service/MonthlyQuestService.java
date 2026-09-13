package com.liferpg.service;

import com.liferpg.dto.MonthlyProgressRequest;
import com.liferpg.dto.MonthlyQuestRequest;
import com.liferpg.dto.QuestCompletionResult;
import com.liferpg.model.ActivityLog;
import com.liferpg.model.MonthlyQuest;
import com.liferpg.model.User;
import com.liferpg.repository.ActivityLogRepository;
import com.liferpg.repository.MonthlyQuestRepository;
import com.liferpg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MonthlyQuestService {

    private final MonthlyQuestRepository monthlyQuestRepository;
    private final UserRepository userRepository;
    private final ProgressionService progressionService;
    private final ActivityLogRepository activityLogRepository;

    public List<MonthlyQuest> getMyMonthlyQuests(String username) {
        User user = getUserByUsername(username);
        return monthlyQuestRepository.findByUserOrderByIdAsc(user);
    }

    public MonthlyQuest createMonthlyQuest(MonthlyQuestRequest request, String username) {
        User user = getUserByUsername(username);

        int xp = request.getXpReward() > 0 ? request.getXpReward() : 800;
        int gold = request.getGoldReward() > 0 ? request.getGoldReward() : 400;

        MonthlyQuest quest = MonthlyQuest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .targetValue(request.getTargetValue())
                .currentValue(0)
                .xpReward(xp)
                .goldReward(gold)
                .user(user)
                .build();

        return monthlyQuestRepository.save(quest);
    }

    @Transactional
    public QuestCompletionResult recordProgress(Long questId, MonthlyProgressRequest request, String username) {
        MonthlyQuest quest = monthlyQuestRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Monthly quest not found!"));

        if (!quest.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized!");
        }

        if (quest.isCompleted()) {
            throw new RuntimeException("This monthly challenge has already been conquered!");
        }

        quest.setCurrentValue(quest.getCurrentValue() + request.getIncrement());

        boolean justCompleted = false;
        int xpGained = 0;
        int goldGained = 0;
        int newAttr = 0;
        User user = quest.getUser();

        // Check if goal reached!
        if (quest.getCurrentValue() >= quest.getTargetValue()) {
            quest.setCurrentValue(quest.getTargetValue());
            quest.setCompleted(true);
            justCompleted = true;

            // Grand Milestone Rewards!
            xpGained = quest.getXpReward();
            goldGained = quest.getGoldReward();
            user.setGold(user.getGold() + goldGained);
            user.setTotalXp(user.getTotalXp() + xpGained);
            user.setCurrentXp(user.getCurrentXp() + xpGained);

            // Grand stat boost: +10 attribute points
            newAttr = progressionService.boostAttribute(user, quest.getCategory(), 10);

            // Award 2 bonus Mystery Chests!
            user.setMysteryChests(user.getMysteryChests() + 2);

            activityLogRepository.save(ActivityLog.builder()
                    .username(user.getUsername())
                    .action("CONQUERED the Monthly Quest: \"" + quest.getTitle() + "\"! 🏆 (+10 " + quest.getCategory() + ")")
                    .xpGained(xpGained)
                    .build());
        }

        // Level-Up evaluation
        boolean leveledUp = false;
        int reqXp = progressionService.getXpRequiredForNextLevel(user.getLevel());
        while (user.getCurrentXp() >= reqXp) {
            user.setCurrentXp(user.getCurrentXp() - reqXp);
            user.setLevel(user.getLevel() + 1);
            user.setMysteryChests(user.getMysteryChests() + 1);
            leveledUp = true;
            reqXp = progressionService.getXpRequiredForNextLevel(user.getLevel());
        }

        monthlyQuestRepository.save(quest);
        userRepository.save(user);

        return QuestCompletionResult.builder()
                .questId(quest.getId())
                .questTitle(quest.getTitle())
                .xpGained(xpGained)
                .goldGained(goldGained)
                .attributeBoosted(quest.getCategory().name())
                .newAttributeValue(newAttr)
                .currentXp(user.getCurrentXp())
                .xpNeededForNextLevel(reqXp)
                .level(user.getLevel())
                .leveledUp(leveledUp)
                .newMysteryChests(user.getMysteryChests())
                .streakDays(user.getStreakDays())
                .build();
    }

    public void deleteMonthlyQuest(Long questId, String username) {
        MonthlyQuest quest = monthlyQuestRepository.findById(questId)
                .orElseThrow(() -> new RuntimeException("Monthly quest not found!"));
        if (!quest.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized!");
        }
        monthlyQuestRepository.delete(quest);
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}