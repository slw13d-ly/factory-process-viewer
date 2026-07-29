package com.factoryview.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.factoryview.backend.domain.board.Board;
import com.factoryview.backend.domain.user.UserAccount;
import com.factoryview.backend.dto.board.BoardCreateRequest;
import com.factoryview.backend.dto.board.BoardNavigationResponse;
import com.factoryview.backend.dto.board.BoardPageResponse;
import com.factoryview.backend.dto.board.BoardResponse;
import com.factoryview.backend.dto.board.BoardUpdateRequest;
import com.factoryview.backend.exception.ForbiddenOperationException;
import com.factoryview.backend.exception.ResourceNotFoundException;
import com.factoryview.backend.repository.BoardRepository;

@Service
@Transactional(readOnly = true)
public class BoardService {

    private static final int MAX_PAGE_SIZE = 50;

    private final BoardRepository boardRepository;
    private final AuthService authService;

    public BoardService(BoardRepository boardRepository, AuthService authService) {
        this.boardRepository = boardRepository;
        this.authService = authService;
    }

    public BoardPageResponse getBoards(int page, int size, String currentUsername) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        String normalizedUsername = AuthService.normalizeUsername(currentUsername);

        Page<Board> boardPage = boardRepository.findPageWithAuthor(
                PageRequest.of(safePage, safeSize)
        );
        return BoardPageResponse.from(boardPage, normalizedUsername);
    }

    public BoardResponse getBoard(Long boardId, String currentUsername) {
        Board board = findBoard(boardId);
        return BoardResponse.from(
                board,
                AuthService.normalizeUsername(currentUsername)
        );
    }

    public BoardNavigationResponse getNavigation(Long boardId) {
        Board current = findBoard(boardId);
        int notice = current.isNotice() ? 1 : 0;
        PageRequest firstOnly = PageRequest.of(0, 1);

        Board previous = boardRepository.findPreviousWithAuthor(
                notice,
                current.getCreatedAt(),
                current.getId(),
                firstOnly
        ).stream().findFirst().orElse(null);

        Board next = boardRepository.findNextWithAuthor(
                notice,
                current.getCreatedAt(),
                current.getId(),
                firstOnly
        ).stream().findFirst().orElse(null);

        return BoardNavigationResponse.from(previous, next);
    }

    @Transactional
    public BoardResponse create(BoardCreateRequest request, String currentUsername) {
        UserAccount author = authService.getByUsername(currentUsername);
        Board board = new Board(
                author,
                normalizeRequired(request.title(), "제목을 입력해 주세요."),
                normalizeRequired(request.content(), "내용을 입력해 주세요."),
                request.notice()
        );

        Board savedBoard = boardRepository.save(board);
        return BoardResponse.from(savedBoard, author.getUsername());
    }

    @Transactional
    public BoardResponse update(
            Long boardId,
            BoardUpdateRequest request,
            String currentUsername
    ) {
        Board board = findBoard(boardId);
        assertAuthor(board, currentUsername);

        board.update(
                normalizeRequired(request.title(), "제목을 입력해 주세요."),
                normalizeRequired(request.content(), "내용을 입력해 주세요."),
                request.notice()
        );
        return BoardResponse.from(board, AuthService.normalizeUsername(currentUsername));
    }

    @Transactional
    public void delete(Long boardId, String currentUsername) {
        Board board = findBoard(boardId);
        assertAuthor(board, currentUsername);
        boardRepository.delete(board);
    }

    private Board findBoard(Long boardId) {
        return boardRepository.findByIdWithAuthor(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("게시글을 찾을 수 없습니다."));
    }

    private void assertAuthor(Board board, String currentUsername) {
        String normalizedUsername = AuthService.normalizeUsername(currentUsername);
        if (!board.getAuthor().getUsername().equals(normalizedUsername)) {
            throw new ForbiddenOperationException("작성자만 게시글을 수정하거나 삭제할 수 있습니다.");
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
