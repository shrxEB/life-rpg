package com.liferpg.service;

import com.liferpg.dto.DailyQuestRequest;
import com.liferpg.dto.DailyQuestResponse;
import com.liferpg.dto.QuestCompletionResult;
import com.liferpg.model.ActivityLog;
import com.liferpg.model.DailyQuest;
import com.liferpg.model.User;
import com.liferpg.repository.ActivityLogRepository;
import com.liferpg.repository.DailyQuestRepository;
import com.liferpg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyQuestService {

    private final DailyQuestRepository dailyQuestRepository;
    private final UserRepository userRepository;
    private final ProgressionService progressionService;
    private final ActivityLogRepository activityLogRepository;

    public List<DailyQuestResponse> getMyDailies(String username) {
        User user = getUserByUsername(username);
        List<DailyQuest> dailies = dailyQuestRepository.findByUserOrderByIdAsc(user);
        LocalDate today = LocalDate.now();

        return dailies.stream().map(d -> mapToResponse(d, today)).toList();
    }

    public DailyQuestResponse createDaily(DailyQuestRequest request, String username) {
        User user = getUserByUsername(username);

        DailyQuest daily = DailyQuest.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .category(request.getCategory())
                .user(user)
                .build();

        dailyQuestRepository.save(daily);
        return mapToResponse(daily, LocalDate.now());
    }

    @Transactional
    public QuestCompletionResult checkInDaily(Long dailyId, String username) {
        DailyQuest daily = dailyQuestRepository.findById(dailyId)
                .orElseThrow(() -> new RuntimeException("Daily quest not found!"));

        if (!daily.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized!");
        }

        LocalDate today = LocalDate.now();
        if (today.equals(daily.getLastCompletedDate())) {
            throw new RuntimeException("You have already checked in for today!");
        }

        // 1. Mark today's specific day in the S M T W T F S week
        markDayOfWeek(daily, today.getDayOfWeek());

        // 2. Update streak
        if (daily.getLastCompletedDate() != null && daily.getLastCompletedDate().equals(today.minusDays(1))) {
            daily.setCurrentStreak(daily.getCurrentStreak() + 1);
        } else {
            daily.setCurrentStreak(1);
        }
        daily.setLastCompletedDate(today);
        dailyQuestRepository.save(daily);

        // 3. Award XP & Gold (+50 XP, +25 Gold)
        User user = daily.getUser();
        int xpGained = 50;
        int goldGained = 25;
        user.setGold(user.getGold() + goldGained);
        user.setTotalXp(user.getTotalXp() + xpGained);
        user.setCurrentXp(user.getCurrentXp() + xpGained);

        // Boost attribute by 1
        int newAttr = progressionService.boostAttribute(user, daily.getCategory(), 1);

        // User streak update
        progressionService.updateStreak(user);

        // Check for Level-Up
        boolean leveledUp = false;
        int reqXp = progressionService.getXpRequiredForNextLevel(user.getLevel());
        while (user.getCurrentXp() >= reqXp) {
            user.setCurrentXp(user.getCurrentXp() - reqXp);
            user.setLevel(user.getLevel() + 1);
            user.setMysteryChests(user.getMysteryChests() + 1);
            leveledUp = true;
            reqXp = progressionService.getXpRequiredForNextLevel(user.getLevel());
        }
        userRepository.save(user);

        // Record to activity log
        activityLogRepository.save(ActivityLog.builder()
                .username(user.getUsername())
                .action("completed daily habit: \"" + daily.getTitle() + "\" (🔥 " + daily.getCurrentStreak() + "-day streak!)")
                .xpGained(xpGained)
                .build());

        return QuestCompletionResult.builder()
                .questId(daily.getId())
                .questTitle(daily.getTitle())
                .xpGained(xpGained)
                .goldGained(goldGained)
                .attributeBoosted(daily.getCategory().name())
                .newAttributeValue(newAttr)
                .currentXp(user.getCurrentXp())
                .xpNeededForNextLevel(reqXp)
                .level(user.getLevel())
                .leveledUp(leveledUp)
                .newMysteryChests(user.getMysteryChests())
                .streakDays(user.getStreakDays())
                .build();
    }

    public void deleteDaily(Long dailyId, String username) {
        DailyQuest daily = dailyQuestRepository.findById(dailyId)
                .orElseThrow(() -> new RuntimeException("Daily quest not found!"));
        if (!daily.getUser().getUsername().equals(username)) {
            throw new RuntimeException("Unauthorized!");
        }
        dailyQuestRepository.delete(daily);
    }

    private void markDayOfWeek(DailyQuest daily, DayOfWeek day) {
        switch (day) {
            case SUNDAY -> daily.setSunday(true);
            case MONDAY -> daily.setMonday(true);
            case TUESDAY -> daily.setTuesday(true);
            case WEDNESDAY -> daily.setWednesday(true);
            case THURSDAY -> daily.setThursday(true);
            case FRIDAY -> daily.setFriday(true);
            case SATURDAY -> daily.setSaturday(true);
        }
    }

    private DailyQuestResponse mapToResponse(DailyQuest d, LocalDate today) {
        return DailyQuestResponse.builder()
                .id(d.getId())
                .title(d.getTitle())
                .description(d.getDescription())
                .category(d.getCategory())
                .currentStreak(d.getCurrentStreak())
                .completedToday(today.equals(d.getLastCompletedDate()))
                .sunday(d.isSunday())
                .monday(d.isMonday())
                .tuesday(d.isTuesday())
                .wednesday(d.isWednesday())
                .thursday(d.isThursday())
                .friday(d.isFriday())
                .saturday(d.isSaturday())
                .build();
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}