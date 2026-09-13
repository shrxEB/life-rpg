package com.liferpg.repository;

import com.liferpg.model.DailyQuest;
import com.liferpg.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DailyQuestRepository extends JpaRepository<DailyQuest, Long> {
    List<DailyQuest> findByUserOrderByIdAsc(User user);
}