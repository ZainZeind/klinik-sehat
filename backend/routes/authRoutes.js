import express from 'express';
import { 
  register, 
  login, 
  getProfile, 
  updateProfile, 
  changePassword,
  getMyNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead
} from '../controllers/authController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, updateProfile);
router.put('/change-password', authenticateToken, changePassword);

// Notification routes
router.get('/notifications', authenticateToken, getMyNotifications);
router.put('/notifications/:notificationId/read', authenticateToken, markNotificationAsRead);
router.put('/notifications/mark-all-read', authenticateToken, markAllNotificationsAsRead);

export default router;
