const express = require('express');
const cors = require('cors');
const auth = require('./middleware/auth');
const cookieParser = require('cookie-parser');

const app = express();
const port = 5001;

// Import your routes
const companyRoutes = require('./routes/company');
const employeeRoutes = require('./routes/employee');
const authRoutes = require('./routes/authentication');
const accountingFirmRoutes = require('./routes/accountingFirmRoutes');
const swaggerSetup = require('./swagger/swagger');
const connectDB = require('./config/database');

// Connect to the database
connectDB();

// Configure environment variables
require('dotenv').config();

// Middleware setup
app.use(express.json());
app.use(cookieParser());

// CORS configuration
const corsOptions = {
    origin: 'http://localhost:3000', // Replace with the actual URL of your frontend
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Swagger setup
swaggerSetup(app);

// Root route
app.get('/', (req, res) => {
    res.send('Server running!');
});

// Use your routes
app.use('/api/companies', companyRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/accounting-firm', accountingFirmRoutes);
app.use('/api/auth', authRoutes);

// Start the server
app.listen(port, () => {
    console.log(`app is running on port ${port}`);
});

// Uncomment these routes if you need them
// app.use('/auth', userRouter);

// app.get('/verified', auth.protect, (req, res) => {
//   res.status(200).send('authenticated page')
// });

// only admin can have access to this route
// app.get('/admin', auth.protect, auth.checkAdmin, (req, res) => {
//   res.status(200).send('authorized page')
// });
