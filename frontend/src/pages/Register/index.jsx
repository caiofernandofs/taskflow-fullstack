import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { register } from '../../services/authService'
import styles from './Register.module.css'

function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  async function handleRegister(e) {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)

    try {
      await register(name, email, password)
      navigate('/')
    } catch (err) {
      const message = err.response?.data?.message || 'Erro ao criar conta. Tente novamente.'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>

        <div className={styles.logo}>
          <span className={styles.logoIcon}>✓</span>
          <h1 className={styles.logoText}>TaskFlow</h1>
        </div>

        <p className={styles.subtitle}>Crie sua conta e comece a organizar suas tarefas.</p>

        <form onSubmit={handleRegister} className={styles.form}>

          <div className={styles.field}>
            <label className={styles.label}>Nome completo</label>
            <input
              className={styles.input}
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input
              className={styles.input}
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Senha</label>
            <input
              className={styles.input}
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Confirmar senha</label>
            <input
              className={`${styles.input} ${confirmPassword && password !== confirmPassword ? styles.inputError : ''}`}
              type="password"
              placeholder="Repita sua senha"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            {confirmPassword && password !== confirmPassword && (
              <span className={styles.fieldHint}>As senhas não coincidem</span>
            )}
          </div>

          {error && (
            <div className={styles.error}>
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            className={styles.button}
            disabled={loading}
          >
            {loading ? (
              <span className={styles.spinner} />
            ) : (
              'Criar conta'
            )}
          </button>

        </form>

        <p className={styles.loginLink}>
          Já tem uma conta?{' '}
          <Link to="/" className={styles.link}>
            Fazer login
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Register
