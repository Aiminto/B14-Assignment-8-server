import express from "express";
import cors from "cors";
import { MongoClient } from 'mongodb';
import 'dotenv/config'

const PORT = process.env.PORT || 5000;

// let obj = {
//     name: "hasan",
//     age: 36,
//     getAge()=>{

//     }
// }


//REST api make connection client and server
// CRUD OPERATION
// C = Create, R= Read U = update d= delete
//Methods==> GET, POST ,PUT = insert kore/PATCH = update, DELETE
const app =express()
app.use(cors());
app.use(express.json());

const client = new MongoClient(process.env.MONGODB_URI);

export async function connectToMongoDB() {
  try {
    await client.connect();
    console.log("You successfully connected to MongoDB!");
    return client;
  } catch (err) {
    console.dir(err);
  }
}

const connectClient = await connectToMongoDB();
const db = connectClient.db("assign-8")
const facilitiesCollection = db.collection("facilities")
// const facilitiesCollection1 = db.collection("facilities")
// const facilitiesCollection2 = db.collection("facilities")





app.get("/event-booking", async(req, res)=>{
  const result = await facilitiesCollection.find().toArray()
  res.send(result);


})


app.post("/event-booking", async(req, res)=>{
  const facilityData = req.body;
  console.log(facilityData)
  const result = await facilitiesCollection.insertOne(facilityData)
  res.send(result)

})

// const users =[
//   {id: 1, name: "Hasan vais", email: "withthemind@gmail.com", age: 24},
//   {id: 1, name: "Home", email: "withthemind@gmail.com", age: 27},
//   {id: 1, name: "about", email: "withthemind@gmail.com", age: 25},
//   {id: 1, name: "contact", email: "withthemind@gmail.com", age: 32},
// ]

// app.get("/users", (req, res)=>{
//     //  res.send({message: " my first server "})
//     res.send(users)
// })






app.listen(PORT, ()=>{
    console.log(`server is running on the port:${PORT}`)
})
