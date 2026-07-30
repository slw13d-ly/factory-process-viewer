import { useState } from 'react'
import './BoardForm.css'

const EMPTY_FORM = {
  title: '',
  content: '',
  notice: false,
}

function hasFinalConsonant(word) {
  const lastCharacter = word.at(-1)
  const code = lastCharacter?.charCodeAt(0) ?? 0
  if (code < 0xac00 || code > 0xd7a3) return false
  return (code - 0xac00) % 28 !== 0
}

function withObjectParticle(word) {
  return `${word}${hasFinalConsonant(word) ? '을' : '를'}`
}

function BoardForm({
  mode,
  authorName,
  initialPost,
  onSubmit,
  onCancel,
  isSubmitting,
  serverError,
  resourceName = '게시글',
  noticeLabel = '공지글로 등록',
}) {
  const [form, setForm] = useState(() =>
    mode === 'edit' && initialPost
      ? {
          title: initialPost.title,
          content: initialPost.content,
          notice: initialPost.notice,
        }
      : EMPTY_FORM,
  )
  const [validationError, setValidationError] = useState('')

  const handleChange = (event) => {
    const { name, value, checked, type } = event.target
    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const title = form.title.trim()
    const content = form.content.trim()

    if (!title) {
      setValidationError('제목을 입력해 주세요.')
      return
    }
    if (!content) {
      setValidationError('내용을 입력해 주세요.')
      return
    }

    setValidationError('')
    await onSubmit({ title, content, notice: form.notice })
  }

  const isEdit = mode === 'edit'
  const resourceWithObjectParticle = withObjectParticle(resourceName)

  return (
    <form className="board-form" onSubmit={handleSubmit}>
      <div className="board-form__heading">
        <div>
          <p className="board-form__eyebrow">
            {isEdit ? `${resourceName} 수정` : `새 ${resourceName}`}
          </p>
          <h2>
            {isEdit
              ? `${resourceWithObjectParticle} 수정합니다`
              : `${resourceWithObjectParticle} 작성합니다`}
          </h2>
        </div>
        <button
          type="button"
          className="board-button board-button--secondary"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </button>
      </div>

      {(validationError || serverError) && (
        <p className="board-form__error" role="alert">
          {validationError || serverError}
        </p>
      )}

      <label className="board-field">
        <span>작성자</span>
        <input value={authorName} readOnly aria-readonly="true" />
        <small>작성자명 변경 불가합니다.</small>
      </label>

      <label className="board-field">
        <span>제목 <strong>*</strong></span>
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          maxLength={200}
          placeholder="제목을 입력하세요"
          required
        />
        <small>{form.title.length}/200</small>
      </label>

      <label className="board-field">
        <span>내용 <strong>*</strong></span>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          maxLength={10000}
          placeholder="내용을 입력하세요"
          rows={12}
          required
        />
        <small>{form.content.length}/10,000</small>
      </label>

      <label className="board-form__notice">
        <input
          type="checkbox"
          name="notice"
          checked={form.notice}
          onChange={handleChange}
        />
        <span>
          <strong>{noticeLabel}</strong>
        </span>
      </label>

      <div className="board-form__actions">
        <button
          type="submit"
          className="board-button board-button--primary"
          disabled={isSubmitting}
        >
          {isSubmitting
            ? '저장 중...'
            : isEdit
              ? '수정 완료'
              : `${resourceName} 등록`}
        </button>
      </div>
    </form>
  )
}

export default BoardForm
