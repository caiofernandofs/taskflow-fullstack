
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { login } from '../../services/authService'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { setUser } = useAuth()
  const navigate = useNavigate()

  async function handleLogin(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await login(email, password)
      localStorage.setItem('token', data.token)
      setUser(data.user)
      navigate('/dashboard')
    } catch (err) {
      setError('E-mail ou senha inválidos. Tente novamente.')
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

        <p className={styles.subtitle}>Bem-vindo de volta! Faça login para continuar.</p>

        <form onSubmit={handleLogin} className={styles.form}>

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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
              'Entrar'
            )}
          </button>

        </form>

        <p className={styles.registerLink}>
          Não tem uma conta?{' '}
          <Link to="/register" className={styles.link}>
            Cadastre-se grátis
          </Link>
        </p>

      </div>
    </div>
  )
}

export default Login
