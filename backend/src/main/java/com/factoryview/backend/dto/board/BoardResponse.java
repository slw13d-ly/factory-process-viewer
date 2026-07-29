package com.factoryview.backend.dto.board;

import java.time.LocalDateTime;

import com.factoryview.backend.domain.board.Board;

public record BoardResponse(
        Long id,
        String title,
        String content,
        boolean notice,
        Long authorId,
        String authorUsername,
        String authorDisplayName,
        LocalDateTime createdAt,
        LocalDateTime updatedAt,
        boolean ownedByMe
) {
    public static BoardResponse from(Board board, String currentUsername) {
        return new BoardResponse(
                board.getId(),
                board.getTitle(),
                board.getContent(),
                board.isNotice(),
                board.getAuthor().getId(),
                board.getAuthor().getUsername(),
                board.getAuthor().getDisplayName(),
                board.getCreatedAt(),
                board.getUpdatedAt(),
                board.getAuthor().getUsername().equals(currentUsername)
        );
    }
}
