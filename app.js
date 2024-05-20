const express = require('express');
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser');

const app = express();
const port = 5001;
const userRouter = require('./routes/userRouter');
const companyRoutes = require('./routes/company');
const employeeRoutes = require('./routes/employee');
require('dotenv').config()
require('./config/database')

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Server running!');
});
app.use('/auth', userRouter);

app.get('/verified', auth.protect, (req, res) => {
  res.status(200).send('authenticated page')
})
// only admin can have access to this route
app.get('/admin', auth.protect, auth.checkAdmin, (req, res) => {
  res.status(200).send('authorized page')
})
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeeRoutes);


app.listen(port, () => {
  console.log(`app is running on port 5001`);
});
