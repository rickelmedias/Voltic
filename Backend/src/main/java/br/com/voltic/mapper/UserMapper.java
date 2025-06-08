package br.com.voltic.mapper;

import org.mapstruct.Mapper;
import br.com.voltic.dto.UserDTO;
import br.com.voltic.dto.UserResponseDTO;
import br.com.voltic.entity.User;

@Mapper(componentModel = "spring")
public interface UserMapper {
    User toEntity(UserDTO dto);
    UserResponseDTO toResponse(User u);
}
