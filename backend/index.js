// Import required modules
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/texter.route');
const authRouter = require('./routes/auth.router')
const protectedRouter = require('./routes/protected.router')
const authenticateUser = require('./authMiddleware/jwtAuth')
// Create an instance of express
const app = express();
require('./config/database').connect()
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
app.use('/protected', authenticateUser, protectedRouter)
const PORT = process.env.PORT || 5175;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});