// Import required modules
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/texter.route');
const authRouter = require('./routes/auth.router')
const protectedRouter = require('./routes/protected.router')
const authenticateUser = require('./authMiddleware/jwtAuth')
// Create an instance of express
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const fs = require('fs');
const https = require('https');
require('./config/database').connect();
const key = fs.readFileSync('./ssl/private.key');
const cert = fs.readFileSync('./ssl/certificate.crt');

const creds = {
	key,
	cert
}

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

app.get('/test',(req,res)=>{
	res.send('This is test')
}
)
//Verification SSL
app.get('/.well-known/pki-validation/B5ED39FF81F2D0D4C59964DF6AA8F00B.txt', (req,res)=>{
	res.sendFile(path.join(__dirname,'B5ED39FF81F2D0D4C59964DF6AA8F00B.txt'));
})
app.use('/onlyvocal', authenticateUser, userRouter);
app.use('/auth',  authRouter)
app.use('/protected', authenticateUser, protectedRouter)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const httpsServer = https.createServer(creds,app);
httpsServer.listen(5175);
