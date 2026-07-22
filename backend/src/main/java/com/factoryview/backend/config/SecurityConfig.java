package com.factoryview.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http)
            throws Exception {

        http
                // 현재는 React 연결 및 CRUD 개발을 위한 임시 설정
                .csrf(csrf -> csrf.disable())

                .authorizeHttpRequests(auth -> auth
                        // 연결 확인 및 추후 로그인 API
                        .requestMatchers(
                                "/api/connection",
                                "/api/auth/**"
                        ).permitAll()

                        // 로그인 구현 전까지 임시로 전체 API 허용
                        .anyRequest().permitAll()
                )

                // Spring Security 기본 로그인 화면 비활성화
                .formLogin(form -> form.disable())

                // 브라우저 기본 인증 팝업 비활성화
                .httpBasic(basic -> basic.disable());

        return http.build();
    }
}