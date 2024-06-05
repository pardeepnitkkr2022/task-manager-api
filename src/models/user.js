const validator=require('validator')
const mongoose=require('mongoose')
const bcrypt=require('bcrypt')
const Task=require('./task')
const jwt=require('jsonwebtoken')
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        
    },
    age:{
        type:Number,
        default:18,
        validate(value){
            if(value<0){
                throw new error("Age must be greater than 18")

           }
           }
         },
    email:{
        type:String,
        unique:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("please provide a valid email address")
        }
    }}
,
password:{
    type:String,
    validate(value){
        if(value.length<6){
            throw new Error("password must be greater than 6")
            }
            }
        },



tokens:[{
    token:{
    type:String,
    required:true
    }
}],

avatar:{
    type:Buffer
}
       
    
},
{
    timestamps:true
})

userSchema.virtual('tasks',{
    ref:'Task',
    localField:'_id',
    foreignField:'owner'
})

userSchema.methods.toJSON=function(){
    const user=this
    const userObject=user.toObject()
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
}

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET); // Use your own secret key
    user.tokens=user.tokens.concat({token})
    await user.save()

  

    return token;
};
userSchema.statics.findByCredentials=async (email,password)=>{
    const user=await User.findOne({email})
    if(!user){
        throw new Error("Unable to login")

    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error("wrong password")
    }
    return user
}


    //middleware

userSchema.pre('save',async function(next){
    const user=this
    console.log('just before saving')
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password,8)
    }
        next()
    
})
userSchema.pre('deleteOne',async function(next){

    const user=this
    await Task.deleteMany({owner:user._id})

    next()
})


const User=mongoose.model('User',userSchema)
module.exports=User

