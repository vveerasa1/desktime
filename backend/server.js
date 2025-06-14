const express= require('express');
const config= require('./config');
const mongoose= require('mongoose');
var cors = require('cors');
const routes= require('./routes/index');

const app=express();
// Connect to MongoDB
mongoose.connect(`${config.mongoDb.url}${config.mongoDb.dbName}`)
    .then(() => {
        console.log('Connected to MongoDB successfully!');
    })
    .catch(error => {
        console.error('MongoDB connection error:', error);
    });


app.listen(config.port,()=>{
    console.log(`Server is Listening on port ${config.port}`)
});
app.use(cors());
app.use(express.json());
app.use("/",routes);
