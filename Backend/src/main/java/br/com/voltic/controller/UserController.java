package br.com.voltic.controller;

import br.com.voltic.dto.UserDTO;
import br.com.voltic.dto.UserResponseDTO;
import br.com.voltic.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/v1/users")
@Tag(name = "Usuários", description = "Gerenciamento de usuários")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    @Operation(summary = "Cria um novo usuário")
    public UserResponseDTO createUser(
            @Valid @RequestBody UserDTO userDTO
    ) {
        return userService.createUser(userDTO);
    }

    @GetMapping
    @Operation(summary = "Lista todos os usuários (Admin)")
    public Page<UserResponseDTO> getAllUsers(
            Pageable pageable
    ) {
        return userService.getAllUsers(pageable);
    }

    @GetMapping("/me")
    @Operation(summary = "Retorna dados do usuário autenticado")
    public UserResponseDTO getMe(
            @AuthenticationPrincipal String username
    ) {
        return userService.getByUsername(username)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuário não encontrado"));
    }
}