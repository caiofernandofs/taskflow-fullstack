import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from '../../components/layout/Layout'
import { getBoards, createBoard, updateBoard, deleteBoard } from '../../services/boardService'
import styles from './projects.module.css'

function Projects() {
  const [boards, setBoards]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing]     = useState(null)   // board em edição ou null
  const [title, setTitle]         = useState('')
  const [saving, setSaving]       = useState(false)

  // eslint-disable-next-line react-hooks/immutability
  useEffect(() => { loadBoards() }, [])

  async function loadBoards() {
    try {
      const data = await getBoards()
      setBoards(data)
    } catch {
      console.error('Erro ao carregar projetos')
    } finally {
      setLoading(false)
    }
  }

  function openCreate() {
    setEditing(null)
    setTitle('')
    setShowModal(true)
  }

  function openEdit(board) {
    setEditing(board)
    setTitle(board.title)
    setShowModal(true)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    try {
      if (editing) {
        await updateBoard(editing.id, title)
        setBoards((prev) => prev.map((b) => b.id === editing.id ? { ...b, title } : b))
      } else {
        const board = await createBoard(title)
        setBoards((prev) => [...prev, board])
      }
      setShowModal(false)
      setTitle('')
      setEditing(null)
    } catch {
      alert('Erro ao salvar projeto.')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Excluir este projeto e todas as suas tasks?')) return
    const previous = boards
    setBoards((prev) => prev.filter((b) => b.id !== id))
    try {
      await deleteBoard(id)
    } catch {
      alert('Erro ao excluir projeto.')
      setBoards(previous)
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

  return (
    <Layout>
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Projetos</h2>
          <p className={styles.subtitle}>
            {boards.length} {boards.length === 1 ? 'projeto' : 'projetos'}
          </p>
        </div>
        <button className={styles.addBtn} onClick={openCreate}>
          + Novo Projeto
        </button>
      </div>

      {boards.length === 0 ? (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📁</p>
          <h3>Nenhum projeto ainda</h3>
          <p>Crie seu primeiro projeto para organizar suas tasks.</p>
          <button className={styles.addBtn} onClick={openCreate}>+ Criar Projeto</button>
        </div>
      ) : (
        <div className={styles.grid}>
          {boards.map((board) => (
            <div key={board.id} className={styles.card}>
              <div className={styles.cardTop}>
                <span className={styles.cardIcon}>📁</span>
                <div className={styles.cardMenu}>
                  <button className={styles.iconBtn} title="Editar" onClick={() => openEdit(board)}>✎</button>
                  <button className={styles.iconBtn} title="Excluir" onClick={() => handleDelete(board.id)}>×</button>
                </div>
              </div>
              <h3 className={styles.cardTitle}>{board.title}</h3>
              <p className={styles.cardDate}>
                Criado em {new Date(board.createdAt).toLocaleDateString('pt-BR')}
              </p>
              <Link to="/dashboard" className={styles.openBtn}>Abrir board →</Link>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className={styles.overlay} onClick={() => setShowModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>{editing ? 'Editar Projeto' : 'Novo Projeto'}</h3>
              <button className={styles.closeBtn} onClick={() => setShowModal(false)}>×</button>
            </div>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Nome do Projeto *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Ex: Projeto Alpha"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn} disabled={saving}>
                  {saving ? 'Salvando...' : (editing ? 'Salvar' : 'Criar Projeto')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}

export default Projects
