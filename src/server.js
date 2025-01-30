const express = require("express")
const connection = require("./config/db")
const userRouter = require("./routes/userRouter")
const taskRouter = require("./routes/taskRouter")
const app = express()
app.use(express.json())




let Port = 3001
app.get("/" , async(req,res)=>{
    res.status(200).send("Welcome to our api")
})


app.use("/user" , userRouter)
app.use("/task" , taskRouter)


app.listen(Port , async()=>{
    try{
        await connection
        console.log("Mongo db is connected")

    }catch(error){
        console.log("Mongo db not connected")
    }
    console.log(`server is running on port ${Port}`)
})