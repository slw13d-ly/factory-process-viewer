import { useCallback, useEffect, useState } from 'react'
import { reportBoardApi } from '../api/reportBoardApi.js'

const EMPTY_PAGE = {
  page: 0,
  size: 10,
  totalElements: 0,
  totalPages: 0,
  first: true,
  last: true,
}

export function useReports({ page = 0, size = 10 } = {}) {
  const [reloadToken, setReloadToken] = useState(0)
  const requestKey = `${page}:${size}:${reloadToken}`
  const [result, setResult] = useState({
    requestKey: null,
    reports: [],
    pageInfo: { ...EMPTY_PAGE, page, size },
    error: '',
  })

  const reload = useCallback(() => {
    setReloadToken((value) => value + 1)
  }, [])

  useEffect(() => {
    let active = true

    reportBoardApi
      .list({ page, size })
      .then((response) => {
        if (!active) return
        setResult({
          requestKey,
          reports: response.content ?? [],
          pageInfo: {
            page: response.page,
            size: response.size,
            totalElements: response.totalElements,
            totalPages: response.totalPages,
            first: response.first,
            last: response.last,
          },
          error: '',
        })
      })
      .catch((requestError) => {
        if (!active) return
        setResult({
          requestKey,
          reports: [],
          pageInfo: { ...EMPTY_PAGE, page, size },
          error: requestError.message,
        })
      })

    return () => {
      active = false
    }
  }, [page, requestKey, size])

  const isLoading = result.requestKey !== requestKey

  return {
    reports: result.reports,
    pageInfo: result.pageInfo,
    isLoading,
    error: isLoading ? '' : result.error,
    reload,
  }
}
