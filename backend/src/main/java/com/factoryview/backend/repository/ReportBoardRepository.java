package com.factoryview.backend.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.factoryview.backend.domain.report.ReportBoard;

public interface ReportBoardRepository extends JpaRepository<ReportBoard, Long> {

    @Query(
            value = """
                    SELECT r
                    FROM ReportBoard r
                    JOIN FETCH r.author
                    ORDER BY r.reportDate DESC, r.createdAt DESC, r.id DESC
                    """,
            countQuery = "SELECT COUNT(r) FROM ReportBoard r"
    )
    Page<ReportBoard> findPageWithAuthor(Pageable pageable);

    @Query("SELECT r FROM ReportBoard r JOIN FETCH r.author WHERE r.id = :id")
    Optional<ReportBoard> findByIdWithAuthor(@Param("id") Long id);

    @Query("""
            SELECT r
            FROM ReportBoard r
            JOIN FETCH r.author
            WHERE r.reportDate > :reportDate
               OR (r.reportDate = :reportDate AND r.createdAt > :createdAt)
               OR (r.reportDate = :reportDate AND r.createdAt = :createdAt AND r.id > :id)
            ORDER BY r.reportDate ASC, r.createdAt ASC, r.id ASC
            """)
    List<ReportBoard> findPreviousWithAuthor(
            @Param("reportDate") LocalDate reportDate,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("id") Long id,
            Pageable pageable
    );

    @Query("""
            SELECT r
            FROM ReportBoard r
            JOIN FETCH r.author
            WHERE r.reportDate < :reportDate
               OR (r.reportDate = :reportDate AND r.createdAt < :createdAt)
               OR (r.reportDate = :reportDate AND r.createdAt = :createdAt AND r.id < :id)
            ORDER BY r.reportDate DESC, r.createdAt DESC, r.id DESC
            """)
    List<ReportBoard> findNextWithAuthor(
            @Param("reportDate") LocalDate reportDate,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("id") Long id,
            Pageable pageable
    );
}
