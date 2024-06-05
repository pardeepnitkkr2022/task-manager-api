const{MongoClient,ObjectId}=require('mongodb')
const id=new ObjectId()
console.log(id.id.length)//id.id give binary buffer which has length 12
console.log(id.toString().length)//this hex string has length 24
console.log(id.getTimestamp())


const databaseName='team_manager'

async function run(){
    const URL='mongodb://127.0.0.1:27017'
    const client=new MongoClient(URL)
try{
    await client.connect()
    const db=client.db(databaseName)
    console.log("connected successfully")
    const collection=db.collection("myteam")
    const result=await collection.insertOne({
        _id:id.toString(),name:"Pardeep",age:19,city:"Kurukshetra",salary:500000})
        await db.collection("myteam").findOne({_id:new ObjectId("6650beb5ca915b6cae1bc95c").toString()}).then((result)=>{
            console.log(result)
        })//findOne does not accept callback instead we use await and it return promise so we use "then" 
 await db.collection("myteam").findOne({_id:result.insertedId}).then((data)=>{
    console.log(data);
 })
 //await db.collection("myteam").find({age:25}).toArray().then((data)=>{
  //  console.log(data)})//find return cursor pointer to the array or list of data items in database
 
 await db.collection("myteam").find({age:25}).count().then((data)=>{
    console.log(data)
 })
    console.log(result)//result gives object which has insertedID and aknowledgment value 
        
    await db.collection("myteam").updateOne({
        _id:new ObjectId("6650beb5ca915b6cae1bc95c").toString()},{$set:{name:"Pardeep Sharma"}
    }).then((data)=>{
        console.log(data)
    })
    await db.collection("myteam").updateMany({
        name:"Rahul"
    },{$set:{
        name:"Rahul Sharma"
    }}).then((data)=>{
        console.log(data.modifiedCount)
    })
    await db.collection("myteam").deleteMany({name:"Pardeep"}).then((data)=>{
        console.log(data)
    })
}
catch(e){
    console.log(e)
}
finally{
    await client.close()//make sure all asynchronous function execute before the execution of ".close" method so we placed it in finally block
}

}
  run()

