const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getNotifications,
    markAsRead,
    markAsUnread,
    markAllRead,
    deleteNotification,
    clearAll,
    testCreateNotification,
    sendGlobalNotification
} = require('../controllers/notificationController');

const adminAuth = (req, res, next) => {
    if (req.user && req.user.role?.toLowerCase() === 'admin') {
        next();
    } else {
        res.status(403).json({ message: "Forbidden: Admin access only" });
    }
};

// All routes require authentication except test
router.get('/', auth, getNotifications);                      // GET   /api/notifications
router.post('/send-global', auth, adminAuth, sendGlobalNotification); // POST /api/notifications/send-global
router.patch('/mark-all-read', auth, markAllRead);            // PATCH /api/notifications/mark-all-read
router.delete('/clear-all', auth, clearAll);                  // DELETE /api/notifications/clear-all
router.patch('/:id/read', auth, markAsRead);                  // PATCH /api/notifications/:id/read
router.patch('/:id/unread', auth, markAsUnread);              // PATCH /api/notifications/:id/unread
router.delete('/:id', auth, deleteNotification);              // DELETE /api/notifications/:id
router.post('/test', testCreateNotification);                 // POST  /api/notifications/test

module.exports = router;

