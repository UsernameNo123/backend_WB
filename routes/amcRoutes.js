import express from 'express';
import { deleteAMC,filterAMC,signinAMC,signoutAMC,signupAMC,viewAMC } from '../controllers/amcController.js';
import protectAMCRoute from '../middlewares/protectRouteAMC.js';

const router = express.Router();
router.post('/signup',signupAMC);
router.post('/signin',signinAMC);
router.post('/signout',signoutAMC);
router.delete('/delete',deleteAMC);
router.get('/fetch',viewAMC);
router.get('/filter',filterAMC);
export default router;