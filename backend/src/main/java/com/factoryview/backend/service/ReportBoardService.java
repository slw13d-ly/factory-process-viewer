package com.factoryview.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.factoryview.backend.domain.report.ReportBoard;
import com.factoryview.backend.domain.user.UserAccount;
import com.factoryview.backend.dto.report.ReportCreateRequest;
import com.factoryview.backend.dto.report.ReportNavigationResponse;
import com.factoryview.backend.dto.report.ReportPageResponse;
import com.factoryview.backend.dto.report.ReportResponse;
import com.factoryview.backend.dto.report.ReportUpdateRequest;
import com.factoryview.backend.exception.ForbiddenOperationException;
import com.factoryview.backend.exception.ResourceNotFoundException;
import com.factoryview.backend.repository.ReportBoardRepository;

@Service
@Transactional(readOnly = true)
public class ReportBoardService {

    private static final int MAX_PAGE_SIZE = 50;

    private final ReportBoardRepository reportBoardRepository;
    private final AuthService authService;

    public ReportBoardService(
            ReportBoardRepository reportBoardRepository,
            AuthService authService
    ) {
        this.reportBoardRepository = reportBoardRepository;
        this.authService = authService;
    }

    public ReportPageResponse getReports(int page, int size, String currentUsername) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        String normalizedUsername = AuthService.normalizeUsername(currentUsername);

        Page<ReportBoard> reportPage = reportBoardRepository.findPageWithAuthor(
                PageRequest.of(safePage, safeSize)
        );
        return ReportPageResponse.from(reportPage, normalizedUsername);
    }

    public ReportResponse getReport(Long reportId, String currentUsername) {
        ReportBoard report = findReport(reportId);
        return ReportResponse.from(
                report,
                AuthService.normalizeUsername(currentUsername)
        );
    }

    public ReportNavigationResponse getNavigation(Long reportId) {
        ReportBoard current = findReport(reportId);
        PageRequest firstOnly = PageRequest.of(0, 1);

        ReportBoard previous = reportBoardRepository.findPreviousWithAuthor(
                current.getReportDate(),
                current.getCreatedAt(),
                current.getId(),
                firstOnly
        ).stream().findFirst().orElse(null);

        ReportBoard next = reportBoardRepository.findNextWithAuthor(
                current.getReportDate(),
                current.getCreatedAt(),
                current.getId(),
                firstOnly
        ).stream().findFirst().orElse(null);

        return ReportNavigationResponse.from(previous, next);
    }

    @Transactional
    public ReportResponse create(ReportCreateRequest request, String currentUsername) {
        UserAccount author = authService.getByUsername(currentUsername);
        ReportBoard report = new ReportBoard(
                author,
                request.reportDate(),
                normalizeRequired(request.title(), "제목을 입력해 주세요."),
                normalizeRequired(request.content(), "내용을 입력해 주세요.")
        );

        ReportBoard savedReport = reportBoardRepository.save(report);
        return ReportResponse.from(savedReport, author.getUsername());
    }

    @Transactional
    public ReportResponse update(
            Long reportId,
            ReportUpdateRequest request,
            String currentUsername
    ) {
        ReportBoard report = findReport(reportId);
        assertAuthor(report, currentUsername);

        report.update(
                request.reportDate(),
                normalizeRequired(request.title(), "제목을 입력해 주세요."),
                normalizeRequired(request.content(), "내용을 입력해 주세요.")
        );
        return ReportResponse.from(report, AuthService.normalizeUsername(currentUsername));
    }

    @Transactional
    public void delete(Long reportId, String currentUsername) {
        ReportBoard report = findReport(reportId);
        assertAuthor(report, currentUsername);
        reportBoardRepository.delete(report);
    }

    private ReportBoard findReport(Long reportId) {
        return reportBoardRepository.findByIdWithAuthor(reportId)
                .orElseThrow(() -> new ResourceNotFoundException("보고서를 찾을 수 없습니다."));
    }

    private void assertAuthor(ReportBoard report, String currentUsername) {
        String normalizedUsername = AuthService.normalizeUsername(currentUsername);
        if (!report.getAuthor().getUsername().equals(normalizedUsername)) {
            throw new ForbiddenOperationException("작성자만 보고서를 수정하거나 삭제할 수 있습니다.");
        }
    }

    private static String normalizeRequired(String value, String message) {
        String normalized = value == null ? "" : value.trim();
        if (normalized.isEmpty()) {
            throw new IllegalArgumentException(message);
        }
        return normalized;
    }
}
