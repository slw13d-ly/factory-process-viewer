package com.factoryview.backend.dto.board;

import com.factoryview.backend.domain.board.Board;

public record BoardNavigationItem(
        Long id,
        String title,
        boolean notice
) {
    public static BoardNavigationItem from(Board board) {
        if (board == null) {
            return null;
        }
        return new BoardNavigationItem(
                board.getId(),
                board.getTitle(),
                board.isNotice()
        );
    }
}
