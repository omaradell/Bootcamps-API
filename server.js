const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const fileupload = require('express-fileupload')
const errorHandeler = require('./middleware/error')
const colors = require('colors');

const connectDB = require('./config/db')

dotenv.config({path: './config/config.env'});

connectDB();

const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses')

const app = express();

// Body parser 
app.use(express.json());


//Dev Logger Middelware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'))
}

app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')))

const PORT = process.env.PORT || 5000;
app.use('/api/v1/bootcamps' , bootcamps);
app.use('/api/v1/courses' , courses);

app.use(errorHandeler);

const server = app.listen(PORT , console.log(`server running in ${process.env.NODE_ENV} on port ${process.env.PORT}`.cyan.bold));

process.on('unhandledRejection' , (err , promise) =>{
    console.log(`Error : ${err.message}`);
    server.close(() => process.exit(1));
});