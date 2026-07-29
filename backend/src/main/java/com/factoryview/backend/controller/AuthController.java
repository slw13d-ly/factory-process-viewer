package com.factoryview.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.logout.SecurityContextLogoutHandler;
import org.springframework.security.web.authentication.session.SessionAuthenticationStrategy;
import org.springframework.security.web.context.SecurityContextRepository;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.factoryview.backend.domain.user.UserAccount;
import com.factoryview.backend.dto.auth.AuthResponse;
import com.factoryview.backend.dto.auth.LoginRequest;
import com.factoryview.backend.dto.auth.MessageResponse;
import com.factoryview.backend.dto.auth.SignupRequest;
import com.factoryview.backend.dto.auth.UserResponse;
import com.factoryview.backend.service.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@Validated
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final SecurityContextRepository securityContextRepository;
    private final SessionAuthenticationStrategy sessionAuthenticationStrategy;
    private final AuthService authService;

    public AuthController(
            AuthenticationManager authenticationManager,
            SecurityContextRepository securityContextRepository,
            SessionAuthenticationStrategy sessionAuthenticationStrategy,
            AuthService authService
    ) {
        this.authenticationManager = authenticationManager;
        this.securityContextRepository = securityContextRepository;
        this.sessionAuthenticationStrategy = sessionAuthenticationStrategy;
        this.authService = authService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@Valid @RequestBody SignupRequest request) {
        UserAccount account = authService.signup(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse("회원가입이 완료되었습니다.", UserResponse.from(account)));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        Authentication authenticationRequest = UsernamePasswordAuthenticationToken.unauthenticated(
                AuthService.normalizeUsername(request.username()),
                request.password()
        );
        Authentication authentication = authenticationManager.authenticate(authenticationRequest);
        sessionAuthenticationStrategy.onAuthentication(authentication, httpRequest, httpResponse);

        SecurityContext context = SecurityContextHolder.createEmptyContext();
        context.setAuthentication(authentication);
        SecurityContextHolder.setContext(context);
        securityContextRepository.saveContext(context, httpRequest, httpResponse);

        UserAccount account = authService.getByUsername(authentication.getName());
        return ResponseEntity.ok(
                new AuthResponse("로그인되었습니다.", UserResponse.from(account))
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> me(Authentication authentication) {
        UserAccount account = authService.getByUsername(authentication.getName());
        return ResponseEntity.ok(UserResponse.from(account));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            Authentication authentication,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        new SecurityContextLogoutHandler().logout(request, response, authentication);
        return ResponseEntity.ok(new MessageResponse("로그아웃되었습니다."));
    }
}
