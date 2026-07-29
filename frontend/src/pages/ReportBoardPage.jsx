/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { reportBoardApi } from '../api/reportBoardApi.js'
import BoardCategoryTabs from '../components/board/BoardCategoryTabs.jsx'
import ReportDetail from '../components/board/ReportDetail.jsx'
import ReportForm from '../components/board/ReportForm.jsx'
import BoardNavigation from '../components/board/BoardNavigation.jsx'
import Pagination from '../components/board/Pagination.jsx'
import PostList from '../components/board/PostList.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useReports } from '../hooks/useReports.js'
import './BoardPage.css'

const PAGE_SIZE = 10
const EMPTY_NAVIGATION = { previous: null, next: null }

function parsePage(value) {
  const parsed = Number.parseInt(value ?? '0', 10)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : 0
}

function isValidPostId(value) {
  return Boolean(value && /^\d+$/.test(value))
}

function ReportBoardPage() {
  const { user } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const requestedPostId = searchParams.get('post')
  const [page, setPage] = useState(() => parsePage(searchParams.get('page')))
  const [mode, setMode] = useState(() => {
    if (searchParams.get('compose') === '1') return 'create'
    return isValidPostId(requestedPostId) ? 'detail' : 'list'
  })
  const [selectedPost, setSelectedPost] = useState(null)
  const [detailLoading, setDetailLoading] = useState(
    isValidPostId(requestedPostId),
  )
  const [navigation, setNavigation] = useState(EMPTY_NAVIGATION)
  const [navigationLoading, setNavigationLoading] = useState(
    isValidPostId(requestedPostId),
  )
  const [navigationError, setNavigationError] = useState('')
  const [actionLoading, setActionLoading] = useState(false)
  const [actionError, setActionError] = useState('')

  const { reports: posts, pageInfo, isLoading, error, reload } = useReports({
    page,
    size: PAGE_SIZE,
  })

  useEffect(() => {
    if (!isValidPostId(requestedPostId)) {
      setDetailLoading(false)
      setNavigation(EMPTY_NAVIGATION)
      setNavigationLoading(false)
      setNavigationError('')
      return undefined
    }

    let active = true
    setMode('detail')
    setDetailLoading(true)
    setNavigationLoading(true)
    setNavigationError('')

    reportBoardApi
      .get(requestedPostId)
      .then((post) => {
        if (!active) return
        setSelectedPost(post)
        setMode('detail')
        setActionError('')
      })
      .catch((requestError) => {
        if (!active) return
        setActionError(requestError.message)
        setSelectedPost(null)
        setMode('list')
      })
      .finally(() => {
        if (active) setDetailLoading(false)
      })

    reportBoardApi
      .navigation(requestedPostId)
      .then((response) => {
        if (!active) return
        setNavigation(response ?? EMPTY_NAVIGATION)
      })
      .catch((requestError) => {
        if (!active) return
        setNavigation(EMPTY_NAVIGATION)
        setNavigationError(requestError.message)
      })
      .finally(() => {
        if (active) setNavigationLoading(false)
      })

    return () => {
      active = false
    }
  }, [requestedPostId])

  const updateLocation = (params = {}) => {
    const next = new URLSearchParams()
    if (page > 0) next.set('page', String(page))
    Object.entries(params).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        next.set(key, String(value))
      }
    })
    setSearchParams(next, { replace: true })
  }

  const openCreate = () => {
    setSelectedPost(null)
    setNavigation(EMPTY_NAVIGATION)
    setNavigationError('')
    setActionError('')
    setMode('create')
    updateLocation({ compose: 1 })
  }

  const openList = () => {
    setSelectedPost(null)
    setNavigation(EMPTY_NAVIGATION)
    setNavigationError('')
    setActionError('')
    setMode('list')
    updateLocation({})
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openDetail = (post) => {
    if (selectedPost?.id === post.id) {
      setMode('detail')
      return
    }
    setDetailLoading(true)
    setNavigationLoading(true)
    setNavigation(EMPTY_NAVIGATION)
    setNavigationError('')
    setSelectedPost(null)
    setMode('detail')
    setActionError('')
    updateLocation({ post: post.id })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const closeEditor = () => {
    setMode(selectedPost ? 'detail' : 'list')
    setActionError('')
    updateLocation(selectedPost ? { post: selectedPost.id } : {})
  }

  const handleCreate = async (payload) => {
    setActionLoading(true)
    setActionError('')
    try {
      const createdPost = await reportBoardApi.create(payload)
      setPage(0)
      setSelectedPost(createdPost)
      setMode('detail')
      setSearchParams({ post: String(createdPost.id) }, { replace: true })
      reload()
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleUpdate = async (payload) => {
    if (!selectedPost) return

    setActionLoading(true)
    setActionError('')
    try {
      const updatedPost = await reportBoardApi.update(selectedPost.id, payload)
      setSelectedPost(updatedPost)
      setMode('detail')
      updateLocation({ post: updatedPost.id })
      reload()

      try {
        const updatedNavigation = await reportBoardApi.navigation(updatedPost.id)
        setNavigation(updatedNavigation ?? EMPTY_NAVIGATION)
        setNavigationError('')
      } catch (requestError) {
        setNavigation(EMPTY_NAVIGATION)
        setNavigationError(requestError.message)
      }
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!selectedPost) return
    const confirmed = window.confirm('이 보고서를 삭제하시겠습니까?')
    if (!confirmed) return

    setActionLoading(true)
    setActionError('')
    try {
      await reportBoardApi.remove(selectedPost.id)
      const shouldMovePreviousPage = page > 0 && posts.length === 1
      const nextPage = shouldMovePreviousPage ? page - 1 : page
      setSelectedPost(null)
      setNavigation(EMPTY_NAVIGATION)
      setMode('list')
      setPage(nextPage)
      setSearchParams(
        nextPage > 0 ? { page: String(nextPage) } : {},
        { replace: true },
      )
      reload()
    } catch (requestError) {
      setActionError(requestError.message)
    } finally {
      setActionLoading(false)
    }
  }

  const handlePageChange = (nextPage) => {
    setPage(nextPage)
    setSelectedPost(null)
    setNavigation(EMPTY_NAVIGATION)
    setMode('list')
    setActionError('')
    setSearchParams(
      nextPage > 0 ? { page: String(nextPage) } : {},
      { replace: true },
    )
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <main className="board-page">
      <header className="board-page__top">
        <div>
          <p className="board-page__eyebrow">COMMUNITY</p>
          <div className="board-page__title-row">
            <h1>게시판</h1>
            <BoardCategoryTabs active="report" />
          </div>
          <p>생산 보고서와 업무 기록을 팀원들과 공유하세요.</p>
        </div>
        <div className="board-page__top-actions">
          {mode !== 'list' ? (
            <button
              type="button"
              className="board-button board-button--secondary"
              onClick={openList}
            >
              전체 보고서 보기
            </button>
          ) : (
            <Link
              to="/dashboard"
              className="board-button board-button--secondary"
            >
              대시보드
            </Link>
          )}
          <button
            type="button"
            className="board-button board-button--primary"
            onClick={openCreate}
          >
            보고서 작성
          </button>
        </div>
      </header>

      {actionError && mode !== 'create' && mode !== 'edit' && (
        <p className="board-page__error" role="alert">
          {actionError}
        </p>
      )}

      {(mode === 'create' || mode === 'edit') && (
        <section className="panel board-page__editor">
          <ReportForm
            key={`${mode}-${selectedPost?.id ?? 'new'}`}
            mode={mode}
            authorName={
              mode === 'edit'
                ? selectedPost?.authorDisplayName ?? user.displayName
                : user.displayName
            }
            initialPost={selectedPost}
            onSubmit={mode === 'edit' ? handleUpdate : handleCreate}
            onCancel={closeEditor}
            isSubmitting={actionLoading}
            serverError={actionError}
          />
        </section>
      )}

      {mode === 'detail' && selectedPost && (
        <>
          <section className="panel board-page__detail">
            <ReportDetail
              post={selectedPost}
              onEdit={() => {
                setActionError('')
                setMode('edit')
              }}
              onDelete={handleDelete}
              isDeleting={actionLoading}
            />
          </section>
          <BoardNavigation
            resourceName="보고서"
            navigation={navigation}
            isLoading={navigationLoading}
            error={navigationError}
            onSelect={openDetail}
          />
        </>
      )}

      {detailLoading && (
        <section className="panel board-page__status">보고서를 불러오는 중입니다.</section>
      )}

      {mode === 'list' && (
        <section className="panel board-page__list-panel">
          <div className="board-page__list-heading">
            <div>
              <h2>전체 보고서</h2>
              <p>보고 기준일 최신순으로 표시되며, 같은 날짜는 최신 작성순으로 정렬됩니다.</p>
            </div>
            <span>총 {pageInfo.totalElements.toLocaleString('ko-KR')}건</span>
          </div>

          {isLoading ? (
            <p className="board-page__status">보고서를 불러오는 중입니다.</p>
          ) : error ? (
            <p className="board-page__error" role="alert">
              {error}
            </p>
          ) : (
            <>
              <PostList posts={posts} onSelect={openDetail} emptyLabel="보고서가 없습니다." />
              <Pagination pageInfo={pageInfo} onPageChange={handlePageChange} />
            </>
          )}
        </section>
      )}
    </main>
  )
}

export default ReportBoardPage
