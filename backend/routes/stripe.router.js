const express = require('express');
const router = express.Router();
// Importing user controller
const protectedController = require('../controllers/protectedController');
 router.post('/stripeWebhook', protectedController.stripeWebhook);
module.exports = router;

