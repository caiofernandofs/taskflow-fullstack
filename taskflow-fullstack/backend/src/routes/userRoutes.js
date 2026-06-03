import { Router } from 'express'
import { register, login, updateProfile } from '../controllers/userController.js'
import { authMiddleware } from '../middlewares/authMiddleware.js'

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.put('/me', authMiddleware, updateProfile)

export default router