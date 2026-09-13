package com.liferpg.repository;

import com.liferpg.model.MonthlyQuest;
import com.liferpg.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MonthlyQuestRepository extends JpaRepository<MonthlyQuest, Long> {
    List<MonthlyQuest> findByUserOrderByIdAsc(User user);
}