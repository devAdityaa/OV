const express = require('express');
const router = express.Router();
// Importing user controller
const authController = require('../controllers/authController');


router.post('/register', authController.registerUser);
router.post('/login', authController.loginUser);
router.get('/userInfo', authController.getUserInfo)


module.exports = router;