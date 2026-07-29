class BoardApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message)
    this.name = 'BoardApiError'
    this.status = status
    this.fieldErrors = fieldErrors
  }
}

async function request(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  })

  const contentType = response.headers.get('content-type') ?? ''
  const body = contentType.includes('application/json')
    ? await response.json()
    : null

  if (!response.ok) {
    throw new BoardApiError(
      body?.message ?? '게시판 요청 처리 중 오류가 발생했습니다.',
      response.status,
      body?.fieldErrors ?? {},
    )
  }

  return body
}

export const boardApi = {
  list({ page = 0, size = 10 } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    return request(`/api/boards?${params.toString()}`)
  },

  get(boardId) {
    return request(`/api/boards/${boardId}`)
  },

  navigation(boardId) {
    return request(`/api/boards/${boardId}/navigation`)
  },

  create(payload) {
    return request('/api/boards', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(boardId, payload) {
    return request(`/api/boards/${boardId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(boardId) {
    return request(`/api/boards/${boardId}`, {
      method: 'DELETE',
    })
  },
}

export { BoardApiError }
