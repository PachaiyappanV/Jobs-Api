
require('dotenv').config();
const express=require('express')
const app=express();
const connectDB=require('./db/connect');
const Job=require('./models/Job');
const mockdata=require('./mock-data.json');

const port=80;




const start=async function(){
    try{
        await connectDB(process.env.MONGO_URI);
        console.log("database connected");
        await Job.create(mockdata)
        app.listen(port,()=>console.log("server started"))
    }
    catch(error){
        console.log(error);
    }


 
}
start();

