package com.factoryview.backend.service;

import java.util.Locale;

import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.factoryview.backend.domain.user.UserAccount;
import com.factoryview.backend.dto.auth.SignupRequest;
import com.factoryview.backend.exception.DuplicateResourceException;
import com.factoryview.backend.repository.UserAccountRepository;

@Service
@Transactional(readOnly = true)
public class AuthService {

    private final UserAccountRepository userAccountRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(
            UserAccountRepository userAccountRepository,
            PasswordEncoder passwordEncoder
    ) {
        this.userAccountRepository = userAccountRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public UserAccount signup(SignupRequest request) {
        String username = normalizeUsername(request.username());
        String email = request.email().trim().toLowerCase(Locale.ROOT);
        String displayName = request.displayName().trim();

        if (!request.password().equals(request.passwordConfirm())) {
            throw new IllegalArgumentException("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
        }
        if (userAccountRepository.existsByUsername(username)) {
            throw new DuplicateResourceException("이미 사용 중인 아이디입니다.");
        }
        if (userAccountRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("이미 가입된 이메일입니다.");
        }

        UserAccount account = new UserAccount(
                username,
                passwordEncoder.encode(request.password()),
                displayName,
                email
        );
        return userAccountRepository.save(account);
    }

    public UserAccount getByUsername(String username) {
        return userAccountRepository.findByUsername(normalizeUsername(username))
                .orElseThrow(() -> new UsernameNotFoundException("사용자를 찾을 수 없습니다."));
    }

    public static String normalizeUsername(String username) {
        return username == null ? "" : username.trim().toLowerCase(Locale.ROOT);
    }
}
