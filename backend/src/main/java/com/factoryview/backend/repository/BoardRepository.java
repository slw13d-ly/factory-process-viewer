package com.factoryview.backend.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.factoryview.backend.domain.board.Board;

public interface BoardRepository extends JpaRepository<Board, Long> {

    @Query(
            value = """
                    SELECT b
                    FROM Board b
                    JOIN FETCH b.author
                    ORDER BY b.notice DESC, b.createdAt DESC, b.id DESC
                    """,
            countQuery = "SELECT COUNT(b) FROM Board b"
    )
    Page<Board> findPageWithAuthor(Pageable pageable);

    @Query("SELECT b FROM Board b JOIN FETCH b.author WHERE b.id = :id")
    Optional<Board> findByIdWithAuthor(@Param("id") Long id);

    @Query("""
            SELECT b
            FROM Board b
            JOIN FETCH b.author
            WHERE b.notice > :notice
               OR (b.notice = :notice AND b.createdAt > :createdAt)
               OR (b.notice = :notice AND b.createdAt = :createdAt AND b.id > :id)
            ORDER BY b.notice ASC, b.createdAt ASC, b.id ASC
            """)
    List<Board> findPreviousWithAuthor(
            @Param("notice") int notice,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("id") Long id,
            Pageable pageable
    );

    @Query("""
            SELECT b
            FROM Board b
            JOIN FETCH b.author
            WHERE b.notice < :notice
               OR (b.notice = :notice AND b.createdAt < :createdAt)
               OR (b.notice = :notice AND b.createdAt = :createdAt AND b.id < :id)
            ORDER BY b.notice DESC, b.createdAt DESC, b.id DESC
            """)
    List<Board> findNextWithAuthor(
            @Param("notice") int notice,
            @Param("createdAt") LocalDateTime createdAt,
            @Param("id") Long id,
            Pageable pageable
    );
}
