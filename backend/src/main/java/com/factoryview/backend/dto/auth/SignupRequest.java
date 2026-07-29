package com.factoryview.backend.dto.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @NotBlank(message = "아이디를 입력해 주세요.")
        @Pattern(
                regexp = "^[A-Za-z0-9_]{4,20}$",
                message = "아이디는 영문, 숫자, 밑줄을 사용해 4~20자로 입력해 주세요."
        )
        String username,

        @NotBlank(message = "사용자 이름을 입력해 주세요.")
        @Size(max = 100, message = "사용자 이름은 100자 이하로 입력해 주세요.")
        String displayName,

        @NotBlank(message = "이메일을 입력해 주세요.")
        @Email(message = "올바른 이메일 형식이 아닙니다.")
        @Size(max = 255, message = "이메일은 255자 이하로 입력해 주세요.")
        String email,

        @NotBlank(message = "비밀번호를 입력해 주세요.")
        @Size(min = 8, max = 72, message = "비밀번호는 8~72자로 입력해 주세요.")
        String password,

        @NotBlank(message = "비밀번호 확인을 입력해 주세요.")
        String passwordConfirm
) {
}
