package com.factoryview.backend.domain.report;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.factoryview.backend.domain.user.UserAccount;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Lob;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;

@Entity
@Table(name = "REPORT_BOARD")
public class ReportBoard {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "report_board_seq_generator")
    @SequenceGenerator(
            name = "report_board_seq_generator",
            sequenceName = "REPORT_BOARD_SEQ",
            allocationSize = 1
    )
    @Column(name = "REPORT_ID", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "AUTHOR_ID", nullable = false, updatable = false)
    private UserAccount author;

    @Column(name = "REPORT_DATE", nullable = false)
    private LocalDate reportDate;

    @Column(name = "TITLE", nullable = false, length = 200)
    private String title;

    @Lob
    @Column(name = "CONTENT", nullable = false)
    private String content;

    @Column(name = "CREATED_AT", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT", nullable = false)
    private LocalDateTime updatedAt;

    protected ReportBoard() {
    }

    public ReportBoard(
            UserAccount author,
            LocalDate reportDate,
            String title,
            String content
    ) {
        this.author = author;
        this.reportDate = reportDate;
        this.title = title;
        this.content = content;
    }

    @PrePersist
    void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public void update(LocalDate reportDate, String title, String content) {
        this.reportDate = reportDate;
        this.title = title;
        this.content = content;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public UserAccount getAuthor() {
        return author;
    }

    public LocalDate getReportDate() {
        return reportDate;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}
