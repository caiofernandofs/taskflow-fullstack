import { Router } from 'express'
import { createBoard, getBoards, updateBoard, deleteBoard } from '../controllers/boardController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/boards', authMiddleware, createBoard)
router.get('/boards', authMiddleware, getBoards)
router.put('/boards/:id', authMiddleware, updateBoard)
router.delete('/boards/:id', authMiddleware, deleteBoard)
export default router