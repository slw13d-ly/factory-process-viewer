// 백엔드 규격이 아직 확정되지 않았다(가정 경로). 실제 규격이 정해지면
// 이 객체 안의 경로 문자열만 바꾸면 이 파일을 쓰는 다른 코드는 손댈 필요가 없다.
const FACTORY_ENDPOINTS = {
  status: '/api/factory/status',
  start: '/api/factory/start',
  stop: '/api/factory/stop',
  restart: '/api/factory/restart',
}

class FactoryControlApiError extends Error {
  constructor(message, status, fieldErrors = {}) {
    super(message)
    this.name = 'FactoryControlApiError'
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
    throw new FactoryControlApiError(
      body?.message ?? '공장 제어 요청 처리 중 오류가 발생했습니다.',
      response.status,
      body?.fieldErrors ?? {},
    )
  }

  return body
}

export const factoryControlApi = {
  getStatus() {
    return request(FACTORY_ENDPOINTS.status)
  },

  start() {
    return request(FACTORY_ENDPOINTS.start, { method: 'POST' })
  },

  stop() {
    return request(FACTORY_ENDPOINTS.stop, { method: 'POST' })
  },

  restart() {
    return request(FACTORY_ENDPOINTS.restart, { method: 'POST' })
  },
}

export { FactoryControlApiError }
