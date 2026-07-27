package com.taskdock.taskdock_api.schedulers;

import com.taskdock.taskdock_api.repositories.UserRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UserCleanupScheduler {

  UserRepository userRepository;

  @Transactional
  @Scheduled(fixedRate = 300000) // Every 5 minutes
  public void deleteExpiredUnverifiedUsers() {

    Instant threshold = Instant.now().minus(1, ChronoUnit.HOURS);

    int deleted = userRepository.deleteExpiredUsers(threshold);

    if (deleted > 0) {
      System.out.println("Deleted " + deleted + " expired unverified users.");
    }
  }
}
