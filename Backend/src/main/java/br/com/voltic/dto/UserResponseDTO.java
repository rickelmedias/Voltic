package br.com.voltic.dto;

import br.com.voltic.entity.User;
import lombok.Data;

@Data
public class UserResponseDTO {
    private String id;
    private String username;
    private String userId;

    public static UserResponseDTO from(User user) {
        UserResponseDTO dto = new UserResponseDTO();
        dto.id = user.getId();
        dto.username = user.getUsername();
        return dto;
    }
}