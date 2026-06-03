import { createContext, useContext, useState, useEffect } from 'react'
import { getMe, logout as logoutService } from '../services/authService'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  // 1. O estado inicial do usuário tenta ler direto do localStorage
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getMe()
        .then((data) => {
          // Se o getMe funcionar, garante que os dados mais recentes estão guardados
          const userData = data?.user || data
          setUser(userData)
          localStorage.setItem('user', JSON.stringify(userData))
        })
        .catch((err) => {
          console.error("Erro ao revalidar usuário no refresh:", err)
          // Opcional: Só remova se o erro for de token expirado (401)
          // Se for erro 404 ou 500 do servidor, mantemos o usuário logado para não deslogar à toa
          if (err.response?.status === 401) {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            setUser(null)
          }
        })
        .finally(() => setLoading(false))
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false)
    }
  }, [])

  const logout = () => {
    logoutService()
    localStorage.removeItem('token')
    localStorage.removeItem('user') // Limpa o usuário no logout
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, setUser, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext)
}