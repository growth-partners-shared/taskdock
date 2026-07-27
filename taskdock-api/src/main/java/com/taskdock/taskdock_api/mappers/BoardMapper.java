package com.taskdock.taskdock_api.mappers;

import com.taskdock.taskdock_api.dtos.boards.CreateBoardRequest;
import com.taskdock.taskdock_api.dtos.boards.UpdateBoardRequest;
import com.taskdock.taskdock_api.entities.Board;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BoardMapper {

  Board toEntity(CreateBoardRequest request);

  @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
  void updateBoardFromRequest(UpdateBoardRequest request, @MappingTarget Board board);
}
