const mongoose=require('mongoose')
const validator=require('validator')
mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("connected to database")
})


//const me= new User({name:"Pardeep Kumar",age:18,email:"pardeep"})//the user constructor should always receive single object and properties
//me.save().then((data)=>{console.log(data)}).catch((e)=>{console.log(e)})
    

module.exports=mongoose