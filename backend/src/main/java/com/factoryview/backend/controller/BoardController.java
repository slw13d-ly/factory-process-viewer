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

import com.factoryview.backend.dto.board.BoardCreateRequest;
import com.factoryview.backend.dto.board.BoardNavigationResponse;
import com.factoryview.backend.dto.board.BoardPageResponse;
import com.factoryview.backend.dto.board.BoardResponse;
import com.factoryview.backend.dto.board.BoardUpdateRequest;
import com.factoryview.backend.service.BoardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

    private final BoardService boardService;

    public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping
    public ResponseEntity<BoardPageResponse> getBoards(
            @RequestParam(name = "page", defaultValue = "0") int page,
            @RequestParam(name = "size", defaultValue = "10") int size,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                boardService.getBoards(page, size, authentication.getName())
        );
    }

    @GetMapping("/{boardId}")
    public ResponseEntity<BoardResponse> getBoard(
            @PathVariable(name = "boardId") Long boardId,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                boardService.getBoard(boardId, authentication.getName())
        );
    }

    @GetMapping("/{boardId}/navigation")
    public ResponseEntity<BoardNavigationResponse> getBoardNavigation(
            @PathVariable(name = "boardId") Long boardId
    ) {
        return ResponseEntity.ok(boardService.getNavigation(boardId));
    }

    @PostMapping
    public ResponseEntity<BoardResponse> createBoard(
            @Valid @RequestBody BoardCreateRequest request,
            Authentication authentication
    ) {
        BoardResponse response = boardService.create(request, authentication.getName());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/{boardId}")
    public ResponseEntity<BoardResponse> updateBoard(
            @PathVariable(name = "boardId") Long boardId,
            @Valid @RequestBody BoardUpdateRequest request,
            Authentication authentication
    ) {
        return ResponseEntity.ok(
                boardService.update(boardId, request, authentication.getName())
        );
    }

    @DeleteMapping("/{boardId}")
    public ResponseEntity<Void> deleteBoard(
            @PathVariable(name = "boardId") Long boardId,
            Authentication authentication
    ) {
        boardService.delete(boardId, authentication.getName());
        return ResponseEntity.noContent().build();
    }
}
