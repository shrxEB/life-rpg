package com.liferpg.service;

import com.liferpg.dto.LeaderboardEntry;
import com.liferpg.dto.PartyCreateRequest;
import com.liferpg.dto.PartyJoinRequest;
import com.liferpg.dto.PartyResponse;
import com.liferpg.model.ActivityLog;
import com.liferpg.model.Party;
import com.liferpg.model.User;
import com.liferpg.repository.ActivityLogRepository;
import com.liferpg.repository.PartyRepository;
import com.liferpg.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PartyService {

    private final PartyRepository partyRepository;
    private final UserRepository userRepository;
    private final LeaderboardService leaderboardService;
    private final ActivityLogRepository activityLogRepository;

    @Transactional
    public PartyResponse createParty(PartyCreateRequest request, String username) {
        User user = getUserByUsername(username);

        if (user.getParty() != null) {
            throw new RuntimeException("You are already in a party! Leave your current party first.");
        }

        String inviteCode = generateUniqueInviteCode();

        Party party = Party.builder()
                .name(request.getName())
                .description(request.getDescription())
                .inviteCode(inviteCode)
                .creatorId(user.getId())
                .build();

        partyRepository.save(party);

        // Add creator to party
        user.setParty(party);
        userRepository.save(user);

        activityLogRepository.save(ActivityLog.builder()
                .username(user.getUsername())
                .action("founded the party: \"" + party.getName() + "\"! 🛡️")
                .xpGained(0)
                .build());

        return getMyParty(username);
    }

    @Transactional
    public PartyResponse joinParty(PartyJoinRequest request, String username) {
        User user = getUserByUsername(username);

        if (user.getParty() != null) {
            throw new RuntimeException("You are already in a party! Leave your current party first.");
        }

        Party party = partyRepository.findByInviteCode(request.getInviteCode().trim().toUpperCase())
                .orElseThrow(() -> new RuntimeException("Invalid party invite code!"));

        user.setParty(party);
        userRepository.save(user);

        activityLogRepository.save(ActivityLog.builder()
                .username(user.getUsername())
                .action("joined the party: \"" + party.getName() + "\"! ⚔️")
                .xpGained(0)
                .build());

        return getMyParty(username);
    }

    public PartyResponse getMyParty(String username) {
        User user = getUserByUsername(username);
        Party party = user.getParty();

        if (party == null) {
            return null; // Not in a party yet
        }

        List<User> members = userRepository.findByPartyOrderByTotalXpDesc(party);
        List<LeaderboardEntry> rankedMembers = leaderboardService.mapToLeaderboardEntries(members);

        return PartyResponse.builder()
                .id(party.getId())
                .name(party.getName())
                .description(party.getDescription())
                .inviteCode(party.getInviteCode())
                .memberCount(members.size())
                .members(rankedMembers)
                .build();
    }

    @Transactional
    public void leaveParty(String username) {
        User user = getUserByUsername(username);
        if (user.getParty() == null) {
            throw new RuntimeException("You are not currently in any party!");
        }

        user.setParty(null);
        userRepository.save(user);
    }

    private String generateUniqueInviteCode() {
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        SecureRandom random = new SecureRandom();
        String code;
        do {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            code = sb.toString();
        } while (partyRepository.existsByInviteCode(code));
        return code;
    }

    private User getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found!"));
    }
}