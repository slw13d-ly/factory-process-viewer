import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import './AuthPage.css'

const INITIAL_FORM = {
  username: '',
  displayName: '',
  email: '',
  password: '',
  passwordConfirm: '',
}

function SignupPage() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(INITIAL_FORM)
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setFieldErrors((current) => ({ ...current, [name]: '' }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setFieldErrors({})

    if (form.password !== form.passwordConfirm) {
      setFieldErrors({ passwordConfirm: '비밀번호가 일치하지 않습니다.' })
      return
    }

    setIsSubmitting(true)
    try {
      await signup(form)
      navigate('/login', {
        replace: true,
        state: { signupSuccess: true },
      })
    } catch (requestError) {
      setError(requestError.message)
      setFieldErrors(requestError.fieldErrors ?? {})
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card" aria-labelledby="signup-title">
        <div className="auth-card__heading">
          <p className="auth-card__eyebrow">MES FACTORY VIEW</p>
          <h1 id="signup-title">회원가입</h1>
          <p>공장 모니터링 서비스를 이용할 계정을 만드세요.</p>
        </div>

        {error && <p className="auth-message auth-message--error">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>아이디</span>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              autoComplete="username"
              placeholder="영문, 숫자, 밑줄 4~20자"
              minLength="4"
              maxLength="20"
              pattern="[A-Za-z0-9_]+"
              required
            />
            {fieldErrors.username && <small>{fieldErrors.username}</small>}
          </label>

          <label className="auth-field">
            <span>사용자 이름</span>
            <input
              type="text"
              name="displayName"
              value={form.displayName}
              onChange={handleChange}
              autoComplete="name"
              placeholder="사용자 본인 성명을 입력하세요"
              maxLength="100"
              required
            />
            {fieldErrors.displayName && <small>{fieldErrors.displayName}</small>}
          </label>

          <label className="auth-field">
            <span>이메일</span>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              placeholder="name@example.com"
              maxLength="255"
              required
            />
            {fieldErrors.email && <small>{fieldErrors.email}</small>}
          </label>

          <label className="auth-field">
            <span>비밀번호</span>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="8자 이상 입력하세요"
              minLength="8"
              maxLength="72"
              required
            />
            {fieldErrors.password && <small>{fieldErrors.password}</small>}
          </label>

          <label className="auth-field">
            <span>비밀번호 확인</span>
            <input
              type="password"
              name="passwordConfirm"
              value={form.passwordConfirm}
              onChange={handleChange}
              autoComplete="new-password"
              placeholder="비밀번호를 다시 입력하세요"
              required
            />
            {fieldErrors.passwordConfirm && <small>{fieldErrors.passwordConfirm}</small>}
          </label>

          <button className="auth-submit" type="submit" disabled={isSubmitting}>
            {isSubmitting ? '가입 처리 중...' : '회원가입'}
          </button>
        </form>

        <p className="auth-card__footer">
          이미 계정이 있나요? <Link to="/login">로그인</Link>
        </p>
      </section>
    </main>
  )
}

export default SignupPage
