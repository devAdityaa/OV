const express = require('express');
const router = express.Router();
// Importing user controller
const {creatorData} = require('../controllers/creatorData.controller');


router.post('/create', creatorData);

module.exports = router;