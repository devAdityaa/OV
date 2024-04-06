const express = require('express');
const router = express.Router();
// Importing user controller
const protectedController = require('../controllers/protectedController');


router.post('/setOnlyfansAccounts', protectedController.setOFA);
router.get('/getOnlyfansAccounts', protectedController.getOFA);
router.post('/cloneVoice', protectedController.cloneVoice);
module.exports = router;