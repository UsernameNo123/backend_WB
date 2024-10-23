import express from 'express'
import { signupUser, signinUser, signoutUser } from '../controllers/userController.js'
import protectRoute from '../middlewares/protectRoute.js'

const router = express.Router()

router.post('/signup', signupUser)
router.post('/signin', signinUser)
router.post('/signout', signoutUser)

export default router