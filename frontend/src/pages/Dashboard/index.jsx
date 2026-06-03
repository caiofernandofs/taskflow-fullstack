import { useState, useEffect } from 'react'
import Layout from '../../components/layout/Layout'
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../../services/taskService'
import { getBoards, createBoard } from '../../services/boardService'
import styles from './Dashboard.module.css'

const COLUMNS = [
  { id: 'TODO',       label: '📋 To Do',        color: '#6b7280' },
  { id: 'IN_PROGRESS', label: '⚡ Em andamento',  color: '#f59e0b' },
  { id: 'DONE',       label: '✅ Concluído',     color: '#10b981' },
]

function Dashboard() {
  const [boards, setBoards]             = useState([])
  const [selectedBoard, setSelectedBoard] = useState(null)
  const [tasks, setTasks]               = useState([])
  const [loadingBoards, setLoadingBoards] = useState(true)
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [showBoardModal, setShowBoardModal] = useState(false)
  const [newTask, setNewTask]           = useState({ title: '', description: '', status: 'TODO' })
  const [newBoardName, setNewBoardName] = useState('')
  const [creating, setCreating]         = useState(false)
  const [draggedTask, setDraggedTask]   = useState(null)

  // ── Carregar boards ───────────────────────────────────
  useEffect(() => {
    loadBoards()
  }, [])

  async function loadBoards() {
    try {
      const data = await getBoards()
      setBoards(data)
      if (data.length > 0) {
        setSelectedBoard(data[0])
      }
    } catch {
      console.error('Erro ao carregar boards')
    } finally {
      setLoadingBoards(false)
    }
  }

  // ── Carregar tasks quando trocar de board ─────────────
  useEffect(() => {
    if (selectedBoard) {
      loadTasks(selectedBoard.id)
    }
  }, [selectedBoard])

  async function loadTasks(boardId) {
    setLoadingTasks(true)
    try {
      const data = await getTasks(boardId)
      setTasks(data)
    } catch {
      console.error('Erro ao carregar tasks')
    } finally {
      setLoadingTasks(false)
    }
  }

  function getTasksByStatus(status) {
    return tasks.filter((t) => t.status === status)
  }

  // ── Criar board ───────────────────────────────────────
  async function handleCreateBoard(e) {
    e.preventDefault()
    if (!newBoardName.trim()) return
    setCreating(true)
    try {
      const board = await createBoard(newBoardName)
      setBoards((prev) => [...prev, board])
      setSelectedBoard(board)
      setNewBoardName('')
      setShowBoardModal(false)
    } catch {
      alert('Erro ao criar board.')
    } finally {
      setCreating(false)
    }
  }

  // ── Criar task ────────────────────────────────────────
  async function handleCreateTask(e) {
    e.preventDefault()
    if (!newTask.title.trim() || !selectedBoard) return
    setCreating(true)
    try {
      const created = await createTask({
        ...newTask,
        boardId: selectedBoard.id,
      })
      setTasks((prev) => [created, ...prev])
      setNewTask({ title: '', description: '', status: 'TODO' })
      setShowTaskModal(false)
    } catch (err) {
      console.error(err.response?.data)
      alert('Erro ao criar task.')
    } finally {
      setCreating(false)
    }
  }

  // ── Deletar task ──────────────────────────────────────
  async function handleDelete(id) {
    setTasks((prev) => prev.filter((t) => t.id !== id))
    try {
      await deleteTask(id)
    } catch {
      loadTasks(selectedBoard.id)
    }
  }

  // ── Drag & Drop ───────────────────────────────────────
  function handleDragStart(task) {
    setDraggedTask(task)
  }

  function handleDragOver(e) {
    e.preventDefault()
  }

  async function handleDrop(status) {
    if (!draggedTask || draggedTask.status === status) return
    const previous = tasks
    setTasks(tasks.map((t) => t.id === draggedTask.id ? { ...t, status } : t))
    setDraggedTask(null)
    try {
      await updateTaskStatus(draggedTask.id, status)
    } catch {
      setTasks(previous)
    }
  }

  // ── Render ─────────────────────────────────────────────
  if (loadingBoards) {
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

      {/* ── Header ── */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Kanban Board</h2>
          <p className={styles.subtitle}>
            {selectedBoard ? selectedBoard.name : 'Nenhum board selecionado'}
          </p>
        </div>
        <div className={styles.headerActions}>
          <button className={styles.secondaryBtn} onClick={() => setShowBoardModal(true)}>
            + Novo Board
          </button>
          {selectedBoard && (
            <button className={styles.addBtn} onClick={() => setShowTaskModal(true)}>
              + Nova Task
            </button>
          )}
        </div>
      </div>

      {/* ── Board Tabs ── */}
      {boards.length > 0 && (
        <div className={styles.boardTabs}>
          {boards.map((board) => (
            <button
              key={board.id}
              className={`${styles.tab} ${selectedBoard?.id === board.id ? styles.tabActive : ''}`}
              onClick={() => setSelectedBoard(board)}
            >
              {board.name}
            </button>
          ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {boards.length === 0 && (
        <div className={styles.emptyState}>
          <p className={styles.emptyIcon}>📋</p>
          <h3>Nenhum board encontrado</h3>
          <p>Crie seu primeiro board para começar a organizar suas tasks.</p>
          <button className={styles.addBtn} onClick={() => setShowBoardModal(true)}>
            + Criar Board
          </button>
        </div>
      )}

      {/* ── Kanban Board ── */}
      {selectedBoard && (
        loadingTasks ? (
          <div className={styles.loadingWrap}>
            <span className={styles.loadingSpinner} />
            <p>Carregando tasks...</p>
          </div>
        ) : (
          <div className={styles.board}>
            {COLUMNS.map((col) => (
              <div
                key={col.id}
                className={styles.column}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(col.id)}
              >
                <div className={styles.columnHeader}>
                  <span className={styles.columnDot} style={{ background: col.color }} />
                  <span className={styles.columnLabel}>{col.label}</span>
                  <span className={styles.columnCount}>{getTasksByStatus(col.id).length}</span>
                </div>

                <div className={styles.cardList}>
                  {getTasksByStatus(col.id).map((task) => (
                    <div
                      key={task.id}
                      className={styles.card}
                      draggable
                      onDragStart={() => handleDragStart(task)}
                    >
                      <div className={styles.cardTop}>
                        <p className={styles.cardTitle}>{task.title}</p>
                        <button
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(task.id)}
                          title="Excluir"
                        >×</button>
                      </div>
                      {task.description && (
                        <p className={styles.cardDesc}>{task.description}</p>
                      )}
                      <div className={styles.cardFooter}>
                        <span
                          className={styles.statusBadge}
                          style={{ background: col.color + '22', color: col.color }}
                        >
                          {col.label}
                        </span>
                      </div>
                    </div>
                  ))}

                  {getTasksByStatus(col.id).length === 0 && (
                    <div className={styles.emptyCol}>Arraste tasks aqui</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* ── Modal Nova Task ── */}
      {showTaskModal && (
        <div className={styles.overlay} onClick={() => setShowTaskModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Nova Task</h3>
              <button className={styles.closeBtn} onClick={() => setShowTaskModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateTask} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Título *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Nome da tarefa"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Descrição</label>
                <textarea
                  className={styles.textarea}
                  placeholder="Descreva a tarefa (opcional)"
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  rows={3}
                />
              </div>
              <div className={styles.field}>
                <label className={styles.label}>Status inicial</label>
                <select
                  className={styles.input}
                  value={newTask.status}
                  onChange={(e) => setNewTask({ ...newTask, status: e.target.value })}
                >
                  {COLUMNS.map((col) => (
                    <option key={col.id} value={col.id}>{col.label}</option>
                  ))}
                </select>
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowTaskModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn} disabled={creating}>
                  {creating ? 'Criando...' : 'Criar Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Modal Novo Board ── */}
      {showBoardModal && (
        <div className={styles.overlay} onClick={() => setShowBoardModal(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div className={styles.modalHeader}>
              <h3>Novo Board</h3>
              <button className={styles.closeBtn} onClick={() => setShowBoardModal(false)}>×</button>
            </div>
            <form onSubmit={handleCreateBoard} className={styles.modalForm}>
              <div className={styles.field}>
                <label className={styles.label}>Nome do Board *</label>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Ex: Projeto Alpha"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  required
                  autoFocus
                />
              </div>
              <div className={styles.modalActions}>
                <button type="button" className={styles.cancelBtn} onClick={() => setShowBoardModal(false)}>
                  Cancelar
                </button>
                <button type="submit" className={styles.submitBtn} disabled={creating}>
                  {creating ? 'Criando...' : 'Criar Board'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </Layout>
  )
}

export default Dashboard
