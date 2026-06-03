import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import { useAuth } from '../../context/AuthContext'
import { getMe, updateMe } from '../../services/authService'
import styles from './Profile.module.css'

function Profile() {
  const { user, setUser } = useAuth()
  const [form, setForm] = useState({
    name: '', email: '', currentPassword: '', newPassword: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [feedback, setFeedback] = useState(null) // { type, message }

  useEffect(() => {
    async function load() {
      try {
        const data = user ?? await getMe()
        setForm((f) => ({ ...f, name: data.name, email: data.email }))
      } catch {
        console.error('Erro ao carregar perfil')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user])

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    setFeedback(null)
    try {
      const payload = { name: form.name, email: form.email }
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword
        payload.newPassword = form.newPassword
      }

      // Correção: Pega a resposta do serviço de forma flexível
      const res = await updateMe(payload)
      
      // Se o backend retornar { user: {...} } usamos res.user, senão usamos o próprio res
      const updatedUser = res?.user || res

      if (!updatedUser) {
        throw new Error('Dados do usuário não retornaram do servidor.')
      }

      // 1. Atualiza o estado global na memória do React (muda o layout imediatamente)
      setUser(updatedUser)
      
      // 2. Sincroniza com o localStorage usando a chave 'user' que configuramos no AuthContext
      localStorage.setItem('user', JSON.stringify(updatedUser))
      
      // Limpa os campos de senha após o sucesso
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '' }))
      setFeedback({ type: 'success', message: 'Perfil updated com sucesso!' })
    } catch (err) {
      console.error('Erro detalhado no Perfil:', err)
      setFeedback({
        type: 'error',
        message: err.response?.data?.error || err.response?.data?.message || 'Erro ao atualizar perfil.'
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className={styles.loadingWrap}>
          <span className={styles.loadingSpinner} />
          <p>Carregando...</p>
        </div>
      </Layout>
    )
  }

  const initial = (form.name || '?').charAt(0).toUpperCase()

  return (
    <Layout>
      <div className={styles.header}>
        <h2 className={styles.title}>Perfil</h2>
        <p className={styles.subtitle}>Gerencie seus dados de conta</p>
      </div>

      <div className={styles.card}>
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>{initial}</div>
          <div>
            <p className={styles.avatarName}>{form.name}</p>
            <p className={styles.avatarEmail}>{form.email}</p>
          </div>
        </div>

        {feedback && (
          <div className={feedback.type === 'success' ? styles.alertOk : styles.alertErr}>
            {feedback.message}
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Nome</label>
            <input className={styles.input} name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>E-mail</label>
            <input className={styles.input} type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>

          <div className={styles.divider}>Alterar senha (opcional)</div>

          <div className={styles.field}>
            <label className={styles.label}>Senha atual</label>
            <input 
              className={styles.input} 
              type="password" 
              name="currentPassword"
              value={form.currentPassword} 
              onChange={handleChange} 
              placeholder="••••••••" 
              autoComplete="new-password" // Evita preenchimento fantasma do navegador
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Nova senha</label>
            <input 
              className={styles.input} 
              type="password" 
              name="newPassword"
              value={form.newPassword} 
              onChange={handleChange} 
              placeholder="••••••••" 
              autoComplete="new-password" // Evita preenchimento fantasma do navegador
            />
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitBtn} disabled={saving}>
              {saving ? 'Salvando...' : 'Salvar alterações'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  )
}

export default Profile