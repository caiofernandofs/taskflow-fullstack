import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import userRoutes from './routes/userRoutes.js'
import boardRoutes from './routes/boardRoutes.js'
import { authMiddleware } from './middlewares/authMiddleware.js'
import taskRoutes from './routes/taskRoutes.js'

const app = express()

app.use(express.json())
app.use(cors())

app.use(userRoutes)
app.use(boardRoutes)
app.use(taskRoutes)

app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow API'
  })
})

app.get('/profile', authMiddleware, (req, res) => {
  return res.json({
    message: 'Rota protegida',
    userId: req.userId
  })
})

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000')
})