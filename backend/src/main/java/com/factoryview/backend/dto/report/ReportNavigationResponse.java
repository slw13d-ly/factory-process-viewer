package com.factoryview.backend.dto.report;

import com.factoryview.backend.domain.report.ReportBoard;

public record ReportNavigationResponse(
        ReportNavigationItem previous,
        ReportNavigationItem next
) {
    public static ReportNavigationResponse from(ReportBoard previous, ReportBoard next) {
        return new ReportNavigationResponse(
                ReportNavigationItem.from(previous),
                ReportNavigationItem.from(next)
        );
    }
}
