package com.factoryview.backend.dto.board;

import java.util.List;

import org.springframework.data.domain.Page;

import com.factoryview.backend.domain.board.Board;

public record BoardPageResponse(
        List<BoardResponse> content,
        int page,
        int size,
        long totalElements,
        int totalPages,
        boolean first,
        boolean last
) {
    public static BoardPageResponse from(Page<Board> boardPage, String currentUsername) {
        List<BoardResponse> content = boardPage.getContent().stream()
                .map(board -> BoardResponse.from(board, currentUsername))
                .toList();

        return new BoardPageResponse(
                content,
                boardPage.getNumber(),
                boardPage.getSize(),
                boardPage.getTotalElements(),
                boardPage.getTotalPages(),
                boardPage.isFirst(),
                boardPage.isLast()
        );
    }
}
