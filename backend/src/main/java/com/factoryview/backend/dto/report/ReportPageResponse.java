package com.factoryview.backend.dto.report;

import java.util.List;

import org.springframework.data.domain.Page;

import com.factoryview.backend.domain.report.ReportBoard;

public record ReportPageResponse(
        List<ReportResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {
    public static ReportPageResponse from(Page<ReportBoard> reportPage, String currentUsername) {
        List<ReportResponse> content = reportPage.getContent().stream()
                .map(report -> ReportResponse.from(report, currentUsername))
                .toList();

        return new ReportPageResponse(
                content,
                reportPage.getNumber(),
                reportPage.getSize(),
                reportPage.getTotalElements(),
                reportPage.getTotalPages(),
                reportPage.isFirst(),
                reportPage.isLast()
        );
    }
}
