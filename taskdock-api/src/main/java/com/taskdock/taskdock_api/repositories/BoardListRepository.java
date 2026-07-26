package com.taskdock.taskdock_api.repositories;

import com.taskdock.taskdock_api.entities.Board;
import com.taskdock.taskdock_api.entities.BoardList;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BoardListRepository extends JpaRepository<BoardList, Long> {

  Optional<BoardList> findByIdAndBoard(Long id, Board board);

  List<BoardList> findAllByBoardOrderByPositionAsc(Board board);

  boolean existsByBoardAndNameIgnoreCase(Board board, String name);

  boolean existsByBoardAndNameIgnoreCaseAndIdNot(Board board, String name, Long id);

  long countByBoard(Board board);

  @Query(
      """
        select coalesce(max(bl.position), 0)
        from BoardList bl
        where bl.board = :board
        """)
  Integer findMaxPositionByBoard(@Param("board") Board board);

  List<BoardList> findAllByBoardAndPositionGreaterThanOrderByPositionAsc(
      Board board, Integer position);

  List<BoardList> findAllByBoardAndPositionGreaterThanEqualOrderByPositionAsc(
      Board board, Integer position);
}
