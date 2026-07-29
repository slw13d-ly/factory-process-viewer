package com.factoryview.backend.dto.board;

import com.factoryview.backend.domain.board.Board;

public record BoardNavigationResponse(
        BoardNavigationItem previous,
        BoardNavigationItem next
) {
    public static BoardNavigationResponse from(Board previous, Board next) {
        return new BoardNavigationResponse(
                BoardNavigationItem.from(previous),
                BoardNavigationItem.from(next)
        );
    }
}
