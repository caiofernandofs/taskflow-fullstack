import { useNavigate, Link } from 'react-router-dom' // 1. Adicionamos o Link aqui
import { useAuth } from '../../context/AuthContext'
import styles from './Layout.module.css'

function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className={styles.wrapper}>

      {/* ── Sidebar ── */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>✓</span>
          <span className={styles.logoText}>TaskFlow</span>
        </div>

        {/* 2. Modificamos os links abaixo substituindo <a> por <Link> e href por to */}
        <nav className={styles.nav}>
          <Link to="/dashboard" className={`${styles.navItem} ${styles.active}`}>
            📋 Dashboard
          </Link>
          <Link to="/projects" className={styles.navItem}>
            📁 Projetos
          </Link>
          <Link to="/profile" className={styles.navItem}>
            👤 Perfil
          </Link>
        </nav>

        <div className={styles.userBox}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>{user?.name || 'Usuário'}</span>
            <span className={styles.userEmail}>{user?.email || ''}</span>
          </div>
          <button className={styles.logoutBtn} onClick={handleLogout} title="Sair">
            ⎋
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className={styles.main}>
        {children}
      </main>

    </div>
  )
}

export default Layout