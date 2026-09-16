package com.vistraa.ecommerce.service;

import com.vistraa.ecommerce.dto.AuthDto;
import com.vistraa.ecommerce.exception.BadRequestException;
import com.vistraa.ecommerce.model.User;
import com.vistraa.ecommerce.repository.UserRepository;
import com.vistraa.ecommerce.security.JwtTokenProvider;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider;

    public AuthService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    public AuthDto.Response login(AuthDto.LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword()));

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("Invalid user credentials"));

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());

        return AuthDto.Response.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }

    public AuthDto.Response register(AuthDto.RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email is already registered!");
        }

        String userRole = (request.getRole() != null && !request.getRole().isBlank())
                ? request.getRole()
                : "ROLE_USER";

        if (!userRole.startsWith("ROLE_")) {
            userRole = "ROLE_" + userRole.toUpperCase();
        }

        User user = User.builder()
                .fullName(request.getFullName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(userRole)
                .build();

        userRepository.save(user);

        String token = tokenProvider.generateToken(user.getEmail(), user.getRole());

        return AuthDto.Response.builder()
                .token(token)
                .email(user.getEmail())
                .role(user.getRole())
                .build();
    }
}