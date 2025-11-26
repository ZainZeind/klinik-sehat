import express from 'express';
import {
  getTodayQueue,
  callQueue,
  completeQueue,
  skipQueue,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getAllPatients,
  getPatientDetail,
  createNotification,
  sendBulkNotification,
  getDashboardStats
} from '../controllers/adminController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// All routes require authentication and admin role
router.use(authenticateToken);
router.use(authorizeRole('admin'));

// Queue Management
router.get('/queue/today', getTodayQueue);
router.post('/queue/call', callQueue);
router.post('/queue/complete', completeQueue);
router.post('/queue/skip', skipQueue);

// User Management
router.get('/users', getAllUsers);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Patient Database
router.get('/patients', getAllPatients);
router.get('/patients/:id', getPatientDetail);

// Notifications
router.post('/notifications', createNotification);
router.post('/notifications/bulk', sendBulkNotification);

// Dashboard
router.get('/dashboard/stats', getDashboardStats);

export default router;
