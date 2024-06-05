const express=require('express')
require('./db/mongoose')
const bcrypt=require('bcrypt')
const Task=require('./models/task')
const User=require('./models/user')
const userRouter=require('./Routers/user')
const taskRouter=require('./Routers/task')
const jwt=require('jsonwebtoken')
const app=express()

const port=process.env.PORT
// app.use((req,res,next)=>{
//     if(req.mehtod=='Get'){
//         res.status(404).send("site is currently under maintainance")
//     }
//     next()
    
// })

// app.use((req,res,next)=>{
//     res.status(404).send("site is currently under maintainance")
// })

const multer=require('multer')
const upload=multer({
    dest:'images'
})
app.post('/upload',upload.single('upload'),(req,res)=>{
    res.send()
})




app.use(express.json())

app.use(userRouter)
app.use(taskRouter)




app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
})

// const main=async()=>{
//     // const task=await Task.findById('665daadc49f04a15cf609fb1')
//     // await task.populate('owner')
//     // console.log(task.owner)
//     const user=await User.findById('665daa8549f04a15cf609fab')
//     await user.populate('tasks')
//     console.log(user.tasks)

// }
// main()
// const myFunction=async()=>{

//     const token=jwt.sign({_id:'abc321'},'heythisismywebsite')
//     console.log(token)
//     const data =jwt.verify(token,'heythisismywebsite')
//     console.log(data)
//     // const password='Pardeep123'
//     // const hashedPassword=await bcrypt.hash(password,8)
//     // console.log(password)
//     // console.log(hashedPassword)
//     // const isMatch =await bcrypt.compare('Pardeep123',hashedPassword)
//     // console.log(isMatch)
// }
// myFunction()