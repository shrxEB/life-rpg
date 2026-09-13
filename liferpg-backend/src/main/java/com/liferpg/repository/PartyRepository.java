package com.liferpg.repository;

import com.liferpg.model.Party;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PartyRepository extends JpaRepository<Party, Long> {
    Optional<Party> findByInviteCode(String inviteCode);
    boolean existsByInviteCode(String inviteCode);
}