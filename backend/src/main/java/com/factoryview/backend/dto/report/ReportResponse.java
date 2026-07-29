package com.factoryview.backend.dto.report;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.factoryview.backend.domain.report.ReportBoard;

public record ReportResponse(
        Long id,
        LocalDate reportDate,
        String title,
        String content,
        Long authorId,
        String authorUsername,
        String authorDisplayName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean ownedByMe
) {
    public static ReportResponse from(ReportBoard report, String currentUsername) {
        return new ReportResponse(
                report.getId(),
                report.getReportDate(),
                report.getTitle(),
                report.getContent(),
                report.getAuthor().getId(),
                report.getAuthor().getUsername(),
                report.getAuthor().getDisplayName(),
                report.getCreatedAt(),
                report.getUpdatedAt(),
                report.getAuthor().getUsername().equals(currentUsername)
        );
    }
}
