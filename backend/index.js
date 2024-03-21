// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/texter.route');
// Create an instance of express
const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
  });


app.use('/onlyvocal', userRouter);

const PORT = process.env.PORT || 5175;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});