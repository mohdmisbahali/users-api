const express = require('express');

const app = express();

const userRoutes = require('./routes/users');

const errorHandler = require('./middlewares/errorhandler');

app.use(express.json());

app.use('/users', userRoutes);

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});