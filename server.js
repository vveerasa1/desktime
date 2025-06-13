const express= require('express');
var cors = require('cors');

const app=express();
port = 4000;
app.listen(port,()=>{
    console.log(`Server is Listening on port ${port}`)
});
app.use(cors());
app.use(express.json());