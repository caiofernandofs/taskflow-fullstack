import api from './api'

export const getTasks = async (boardId) => {
  const response = await api.get(`/boards/${boardId}/tasks`)
  return response.data
}

export const createTask = async ({ title, description, status, boardId }) => {
  const response = await api.post('/tasks', {
    title,
    description,
    status,
    boardId
  })
  return response.data
}

export const updateTask = async (id, { title, description, status }) => {
  const response = await api.put(`/tasks/${id}`, { title, description, status })
  return response.data
}

export const updateTaskStatus = async (id, status) => {
  const response = await api.put(`/tasks/${id}`, { status })
  return response.data
}

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`)
  return response.data
}
