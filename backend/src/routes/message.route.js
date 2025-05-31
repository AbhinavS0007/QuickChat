import express from 'express';
import { protectRoute } from '../middlewares/auth.middleware.js';
import { getMessages, getUsersForSidebar, sendMessages } from '../contollers/message.controller.js';

const router = express.Router();
 
router.get('/users',protectRoute,getUsersForSidebar);
router.get('user/:id',protectRoute,getMessages);
router.post('/send/:id',protectRoute,sendMessages)

export default router;