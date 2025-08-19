// Load environment variables from .env file
require('dotenv').config();

const express= require('express');
const config= require('./config');
const mongoose= require('mongoose');
var cors = require('cors');
const routes= require('./routes/index');

const app=express();

// Log AWS SDK configuration status
console.log('AWS Region:', config.AWS.region);
console.log('AWS SDK configured to use:', process.env.AWS_ACCESS_KEY_ID ? 'Environment variables' : 'IAM roles/config files');

// Connect to MongoDB
mongoose.connect(`${config.mongoDb.url}${config.mongoDb.dbName}`)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
    });
app.use(cors());
app.use(express.json());
app.use("/",routes);
console.log('Server is running in', config.env,config.port, 'mode');
app.listen(4005,()=>{
    console.log(`Server is Listening on port ${config.port}`)
});

