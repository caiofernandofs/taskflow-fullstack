import { Router } from 'express'
import { createTask, getTasks, updateTask, deleteTask } from '../controllers/taskController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/tasks', authMiddleware, createTask)
router.get('/boards/:boardId/tasks', authMiddleware, getTasks) 
router.put('/tasks/:id', authMiddleware, updateTask)
router.delete('/tasks/:id', authMiddleware, deleteTask)

export default router