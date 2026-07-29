package com.factoryview.backend.controller;

import java.time.LocalDateTime;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ConnectionController {

    @GetMapping("/connection")
    public ResponseEntity<Map<String, Object>> checkConnection() {
        Map<String, Object> response = Map.of(
                "connected", true,
                "message", "React와 Spring Boot가 연결되었습니다.",
                "serverTime", LocalDateTime.now()
        );

        return ResponseEntity.ok(response);
    }
}