package com.factoryview.backend.dto.report;

import java.time.LocalDate;

import com.factoryview.backend.domain.report.ReportBoard;

public record ReportNavigationItem(
        Long id,
        LocalDate reportDate,
        String title
) {
    public static ReportNavigationItem from(ReportBoard report) {
        if (report == null) {
            return null;
        }
        return new ReportNavigationItem(
                report.getId(),
                report.getReportDate(),
                report.getTitle()
        );
    }
}
