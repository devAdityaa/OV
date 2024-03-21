const express = require('express');
const router = express.Router();

// Importing user controller
const gptController = require('../controllers/gptController');


router.post('/vocalShort', gptController.getShortResponse);
router.post('/vocalLong', gptController.getLongResponse);
router.post('/vocalTexting', gptController.getTextingResponse);
router.post('/vocalPpv', gptController.getPpvResponse);
router.post('/vocalQuestion', gptController.getQuestionResponse);
router.post('/vocalSexting', gptController.getSextingResponse);
router.post('/vocalTTS', gptController.getVocalResponse);




module.exports = router;