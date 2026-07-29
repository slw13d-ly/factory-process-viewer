package com.factoryview.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.factoryview.backend.dto.report.ReportCreateRequest;
import com.factoryview.backend.dto.report.ReportNavigationResponse;
import com.factoryview.backend.dto.report.ReportPageResponse;
import com.factoryview.backend.dto.report.ReportResponse;
import com.factoryview.backend.dto.report.ReportUpdateRequest;
import com.factoryview.backend.service.ReportBoardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/report-boards")
public class ReportBoardController {

    private final ReportBoardService reportBoardService;

    public ReportBoardController(ReportBoardService reportBoardService) {
        this.reportBoardService = reportBoardService;
    }

    @GetMapping
    public ResponseEntity<ReportPageResponse> getReports(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reportBoardService.getReports(page, size, authentication.getName())
        );
    }

    @GetMapping("/{reportId}")
    public ResponseEntity<ReportResponse> getReport(
            @PathVariable(name = "reportId") Long reportId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reportBoardService.getReport(reportId, authentication.getName())
        );
    }

    @GetMapping("/{reportId}/navigation")
    public ResponseEntity<ReportNavigationResponse> getReportNavigation(
            @PathVariable(name = "reportId") Long reportId
    ) {
        return ResponseEntity.ok(reportBoardService.getNavigation(reportId));
    }

    @PostMapping
    public ResponseEntity<ReportResponse> createReport(
            @Valid @RequestBody ReportCreateRequest request,
            Authentication authentication
    ) {
        ReportResponse response = reportBoardService.create(
                request,
                authentication.getName()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{reportId}")
    public ResponseEntity<ReportResponse> updateReport(
            @PathVariable(name = "reportId") Long reportId,
            @Valid @RequestBody ReportUpdateRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                reportBoardService.update(reportId, request, authentication.getName())
        );
    }

    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(
            @PathVariable(name = "reportId") Long reportId,
            Authentication authentication
    ) {
        reportBoardService.delete(reportId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
