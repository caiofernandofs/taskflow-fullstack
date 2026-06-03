
import api from './api'

export const login = async (email, password) => {
  const response = await api.post('/login', { email, password })
  return response.data // { token, user }
}

export const register = async (name, email, password) => {
  const response = await api.post('/register', { name, email, password })
  return response.data
}

export const getMe = async () => {
  const response = await api.get('/me')
  return response.data
}

export const logout = () => {
  localStorage.removeItem('token')
}

export const updateMe = async (data) => {
  const response = await api.put('/me', data)
  return response.data // { message, user }
}
