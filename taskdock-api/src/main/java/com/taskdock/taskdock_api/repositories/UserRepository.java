package com.taskdock.taskdock_api.repositories;

import com.taskdock.taskdock_api.entities.User;
import jakarta.transaction.Transactional;
import java.time.Instant;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

  Optional<User> findByEmail(String email);

  Optional<User> findByPhoneNumber(String phoneNumber);

  boolean existsByEmail(String email);

  boolean existsByPhoneNumber(String phoneNumber);

  @Modifying
  @Transactional
  @Query(
      """
        DELETE FROM User u
        WHERE u.emailVerified = false
        AND u.createdAt < :time
    """)
  int deleteExpiredUsers(@Param("time") Instant time);
}
