package com.taskdock.taskdock_api.repositories;

import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.User;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

  boolean existsByOwnerAndNameIgnoreCase(User owner, String name);

  boolean existsByOwnerAndNameIgnoreCaseAndIdNot(User owner, String name, Long boardId);

  List<Board> findAllByOwner(User owner);

  long countByOwner(User owner);

  Optional<Board> findByIdAndOwner(Long boardId, User owner);
}
