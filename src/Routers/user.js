const express=require('express')
const router=new express.Router()
const User=require('../models/user')
const bodyParser=require('body-parser')
const jwt=require('jsonwebtoken')
const auth=require('../middleware/auth')
const multer=require('multer')
const sharp=require('sharp')
const {sendWelcomeEmail,whyLeavingMyWebsite}=require('../emails/account')
router.use(bodyParser.json());


router.post('/Users',async (req,res)=>{
    const user=new User(req.body)
    try{
        sendWelcomeEmail(user.email,user.name)
        const token=await   user.generateAuthToken()
        
   
   await user.save()
   res.status(201).send({user,token})
    }
   catch(e){
    res.status(400).send(e)
   }
}
   )

 

router.get('/Users/me',auth,async (req,res)=>{
    try{
    // const users=await User.find({})
    
        res.send(req.user)
    }
    catch(e){
        res.status(500).send(e)
    }
   
})


const upload=multer({
    // dest:'images',
    limits:{
        fileSize:1000000
    },
    fileFilter(req,file,cb){
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/)){
            return cb( new Error('Please upload a pdf file'))
        }
        cb(undefined,true)
    }
})
router.post('/Users/me/avatar',auth,upload.single('avatar'),async (req,res)=>{
    const buffer=await sharp(req.file.buffer).resize({width:25,height:25}).png().toBuffer()
    req.user.avatar=buffer
    await req.user.save()
    res.send()
},(error,req,res,next)=>{
    res.status(400).send({error:error.message})
})

router.delete('/Users/me/avatar',auth,async(req,res)=>{
    req.user.avatar=undefined
    await req.user.save()
    res.send()
})

router.get('/Users/:id/avatar',async(req,res)=>{
    try{
    const user=await User.findById(req.params.id)
    if(!user||!user.avatar){
throw new Error()
    }
    res.set('Content-Type','image/png')
    res.send(user.avatar)
}
    catch(e){
        res.status(404).send()
    }
})

router.get('/Users/:id',async (req,res)=>{
    const _id=req.params.id
    try{
    const user=await User.findById(_id)
         if(!user){
            return res.status(404).send()
    }
    res.send(user)
    
}
catch(e){
    res.status(500).send(e)
}
})

router.patch('/Users/me',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }

    try{
       // const user=await User.findById(req.params.id)
        updates.forEach((update)=>req.user[update]=req.body[update])
        await req.user.save()
       // const user=await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        // if(!user){
        //     return res.status(400).send()
        // }
        res.send(req.user)
    }
    catch(e){
        res.status(400).send(e)}
})

router.post('/Users/login',async (req,res)=>{
    try{
        const user=await User.findByCredentials(req.body.email,req.body.password)
        sendWelcomeEmail(user.email,user.name)
       const token=await user.generateAuthToken()
        console.log('Token generated:', token);
        res.send({user,token})

}
catch(e){
    console.log(e)
    res.status(400).send(e)
}})

router.delete('/Users/me', auth, async (req, res) => {
    try {
        if (!req.user) {
            return res.status(404).send({ error: 'User not found' });
        }

        await User.deleteOne({ _id: req.user._id });
        whyLeavingMyWebsite(req.user.email,req.user.name)
        res.send(req.user);
    } catch (e) {
        console.error(e);  // Log the error to the console
        res.status(500).send({ error: 'Internal Server Error', details: e.message });
    }
});

router.post('/Users/logout',auth,async(req,res)=>{
    try{
        req.user.tokens=req.user.tokens.filter((token)=>{
            return token.token!==req.token
        })
        await req.user.save()
        res.send()
    }
       
    catch(e){
        res.status(500).send()
    }})
    router.post('/Users/logoutAll',auth,async(req,res)=>{
        try{
            req.user.tokens=[]
            await req.user.save()
            res.send()
        }
        catch(e){
            res.status(500).send()
        }

    })

module.exports=router