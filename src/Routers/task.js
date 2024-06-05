const express=require('express')
const mongoose=require('mongoose')
const Task=require('../models/task')
const auth=require('../middleware/auth')
const router=new express.Router()

router.post('/tasks',auth,async (req,res)=>{
    // const task=new Task(req.body)

    const task=new Task({
        ...req.body,owner:req.user._id
    })
    try{
        await task.save()
        res.status(201).send(task)
    }
    catch(e){
        res.status(400).send(e)

    }
})

router.get('/tasks',auth,async(req,res)=>{
    try{
        const match={}
        const sort={}
        const parts=req.query.sortBy.split(':')
        sort[parts[0]]=parse[1]==='desc'?-1:1
        
        if(req.query.completed){
            match.completed=req.query.completed==='true'
        }
        // const tasks=await Task.find({owner:req.user._id})
        await req.user.populate({
            path:'tasks',
            match,
            options:{limit:parseInt(req.query.limit),
                skip:parseInt(req.query.skip)},
                sort
        })
     res.send(req.user.tasks)
        }

        catch(e){
            res.status(500).send()
        }
})

router.get('/tasks/:id',auth,async(req,res)=>{
    const _id=req.params.id
    try{
        // const task=await Task.findById(_id)
        const task=await Task.findOne({_id,owner:req.user._id})

        //or await req.user.populate('tasks) res.send(req.user.tasks)
        if(!task){
            return res.status(404).send()
        }
        res.send(task)
    }
    catch(e){
        res.status(500).send()
    }
})
router.patch('/tasks/:id',auth,async (req,res)=>{
    const updates=Object.keys(req.body)
    const allowedUpdates=['description','completed']
    const isValidOperation=updates.every((update)=>allowedUpdates.includes(update))
if(!isValidOperation){
    res.status(400).send({error:'invalid updates'})
}

try{
    //const task=await Task.findByIdandUpdate(req.params.id,req.bod,{new:true,runValidators:true})
    const task=await Task.findOne({_id:req.params.id,owner:req.user._id})

    if(!task){
        return res.status(404).send()
    }

    updates.forEach((update)=>{
        task[update]=req.body[update]
    })
    await task.save()
    res.send(task)

}
catch(e){
    res.status(400).send({details:e.message})
}
})

router.delete('/tasks/:id',auth,async(req,res)=>{
    try{
    const task=await Task.deleteOne({_id:req.params.id,owner:req.user._id})
    if(!task){
        res.status(404).send()
    }
    res.send(task)
}
catch(e){
    res.status(500).send(e)
}
})



module.exports=router