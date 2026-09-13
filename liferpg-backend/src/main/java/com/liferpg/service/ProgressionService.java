package com.liferpg.service;

import com.liferpg.model.Task;
import com.liferpg.model.User;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class ProgressionService {

    public int getXpRequiredForNextLevel(int currentLevel) {
        return (int) Math.floor(100 * Math.pow(currentLevel, 1.5));
    }

    public void updateStreak(User user) {
        LocalDate today = LocalDate.now();
        LocalDate lastActive = user.getLastActiveDate();

        if (lastActive == null) {
            user.setStreakDays(1);
        } else if (lastActive.equals(today.minusDays(1))) {
            user.setStreakDays(user.getStreakDays() + 1);
        } else if (!lastActive.equals(today)) {
            user.setStreakDays(1);
        }
        user.setLastActiveDate(today);
    }

    public int boostAttribute(User user, Task.AttributeCategory category, int boost) {
        switch (category) {
            case STRENGTH -> {
                user.setStrength(user.getStrength() + boost);
                return user.getStrength();
            }
            case INTELLECT -> {
                user.setIntellect(user.getIntellect() + boost);
                return user.getIntellect();
            }
            case DISCIPLINE -> {
                user.setDiscipline(user.getDiscipline() + boost);
                return user.getDiscipline();
            }
            case CREATIVITY -> {
                user.setCreativity(user.getCreativity() + boost);
                return user.getCreativity();
            }
            case CHARISMA -> {
                user.setCharisma(user.getCharisma() + boost);
                return user.getCharisma();
            }
            default -> {
                return 10;
            }
        }
    }
}