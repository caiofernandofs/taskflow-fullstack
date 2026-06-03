import api from './api'

export const getBoards = async () => {
  const response = await api.get('/boards')
  return response.data
}

export const createBoard = async (title) => {
  const response = await api.post('/boards', { title })
  return response.data
}

export const updateBoard = async (id, title) => {
  const response = await api.put(`/boards/${id}`, { title })
  return response.data
}

export const deleteBoard = async (id) => {
  const response = await api.delete(`/boards/${id}`)
  return response.data
}
