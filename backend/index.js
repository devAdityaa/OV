// Import required modules
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/texter.route');
const authRouter = require('./routes/auth.router')
const protectedRouter = require('./routes/protected.router')
const stripeRouter = require('./routes/stripe.router')
const createDataRouter = require('./routes/creatorData.router')
const authenticateUser = require('./authMiddleware/jwtAuth')
require('dotenv').config()
const stripe = require('stripe')(process.env.STRIPE_SECRET)
// Create an instance of express
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const https = require('https');
require('./config/database').connect();
app.use('/stripe', express.raw({type: 'application/json'}), stripeRouter);


app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.json());
app.use(cors())
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });

app.use('/onlyvocal', authenticateUser, userRouter);
app.use('/auth',  authRouter)
app.use('/protected',authenticateUser, protectedRouter)
app.use('/createdata',authenticateUser, createDataRouter)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
