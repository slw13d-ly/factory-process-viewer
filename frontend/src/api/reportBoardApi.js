class ReportBoardApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message)
    this.name = 'ReportBoardApiError'
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
    throw new ReportBoardApiError(
      body?.message ?? '보고서 요청 처리 중 오류가 발생했습니다.',
      response.status,
      body?.fieldErrors ?? {},
    )
  }

  return body
}

export const reportBoardApi = {
  list({ page = 0, size = 10 } = {}) {
    const params = new URLSearchParams({
      page: String(page),
      size: String(size),
    })
    return request(`/api/report-boards?${params.toString()}`)
  },

  get(reportId) {
    return request(`/api/report-boards/${reportId}`)
  },

  navigation(reportId) {
    return request(`/api/report-boards/${reportId}/navigation`)
  },

  create(payload) {
    return request('/api/report-boards', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  update(reportId, payload) {
    return request(`/api/report-boards/${reportId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    })
  },

  remove(reportId) {
    return request(`/api/report-boards/${reportId}`, {
      method: 'DELETE',
    })
  },
}

export { ReportBoardApiError }
