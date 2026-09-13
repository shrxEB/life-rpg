package com.liferpg.repository;

import com.liferpg.model.Party;
import com.liferpg.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

    // Global Rankings: Fetch top 50 players sorted by Total XP
    List<User> findTop50ByOrderByTotalXpDesc();

    // Party Rankings: Fetch all members in a party sorted by Total XP
    List<User> findByPartyOrderByTotalXpDesc(Party party);
}