package br.com.voltic.service;

import br.com.voltic.dto.UserDTO;
import br.com.voltic.dto.UserResponseDTO;
import br.com.voltic.entity.User;
import br.com.voltic.mapper.UserMapper;
import br.com.voltic.repository.UserRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.Collections;
import java.util.Optional;
import java.util.UUID;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository,
                       PasswordEncoder passwordEncoder,
                       UserMapper userMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userMapper = userMapper;
    }

    public UserResponseDTO createUser(UserDTO userDTO) {
        userRepository.findByUsername(userDTO.getUsername())
            .ifPresent(u -> {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Username já existe");
            });

        User user = userMapper.toEntity(userDTO);
        user.setId(UUID.randomUUID().toString());
        user.setUserId(user.getId());
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRoles(Collections.singletonList("ROLE_USER"));

        User saved = userRepository.save(user);
        return userMapper.toResponse(saved);
    }

    public Page<UserResponseDTO> getAllUsers(Pageable pageable) {
        return userRepository.findAll(pageable)
            .map(userMapper::toResponse);
    }

    public Optional<UserResponseDTO> getByUsername(String username) {
        return userRepository.findByUsername(username)
            .map(userMapper::toResponse);
    }
}