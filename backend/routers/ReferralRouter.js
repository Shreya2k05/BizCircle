const express = require('express');
const { 
    createReferral, 
    getMySentReferrals, 
    getMyReceivedReferrals, 
    updateReferralStatus,
    verifyReferral,
    resendVerification,
    manualVerifyReferral
} = require('../controllers/referralController');
const auth = require('../middleware/auth');

const router = express.Router();

// Public verification route
router.get('/verify', verifyReferral);

// Authenticated routes
router.post('/', auth, createReferral);
router.get('/sent', auth, getMySentReferrals);
router.get('/received', auth, getMyReceivedReferrals);
router.put('/:id/status', auth, updateReferralStatus);
router.put('/:id/manual-verify', auth, manualVerifyReferral);
router.post('/:id/resend', auth, resendVerification);

module.exports = router;
