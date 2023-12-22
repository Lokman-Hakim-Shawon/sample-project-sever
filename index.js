const express=require('express')
const cors=require('cors')
const port=process.env.PORT || 5000
const app=express()
app.use(cors())
app.use(express.json())
require('dotenv').config()
// sample-project-server
// iLJW93Z9vDNrcyU1


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_DB}:${process.env.PASS_DB}@cluster0.trqhxan.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("sample-project-server").collection("task");
    app.post('/task',async(req,res)=>{
        const newuser=req.body
        const result=await database.insertOne(newuser)
        res.send(result)
    })
    app.get('/task',async(req,res)=>{
        const result = await database.find().toArray();
        res.send(result)
    })
    app.put('/task/:id',async(req,res)=>{
      const id=req.params.id
      const filter={_id:new ObjectId(id)}
      const updaterequest=req.body
      const option={upsert:true}
      const update={
        $set:{
          title:updaterequest.title,
          img:updaterequest.img,
          deadline:updaterequest.deadline,
          des:updaterequest.des
        }
      }
      const result= await database.updateOne(filter,update,option)
      res.send(result)
    })
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send("server is running")
})
app.listen(port,()=>{
    console.log('server port is :', port)
})