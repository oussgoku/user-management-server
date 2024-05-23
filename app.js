const express = require('express');
const auth = require('./middleware/auth')
const cookieParser = require('cookie-parser');

const app = express();
const port = 5001;
// const userRouter = require('./routes/userRouter');
const companyRoutes = require('./routes/company');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/authentication');
const swaggerSetup = require('./swagger/swagger');
const Company = require('./model/Company');
swaggerSetup(app);
const connectDB = require('./config/database');

connectDB();

require('dotenv').config()
require('./config/database')

app.use(express.json());
app.use(cookieParser());


app.get('/', (req, res) => {
  res.send('Server running!');
});


app.use('/api/companies', companyRoutes);

app.use('/api/employees', employeeRoutes);
app.use('/auth', authRoutes);


app.listen(port, () => {
  console.log(`app is running on port 5001`);
});
// app.use('/auth', userRouter);

// app.get('/verified', auth.protect, (req, res) => {
//   res.status(200).send('authenticated page')
// })
// // only admin can have access to this route
// app.get('/admin', auth.protect, auth.checkAdmin, (req, res) => {
//   res.status(200).send('authorized page')
// })
