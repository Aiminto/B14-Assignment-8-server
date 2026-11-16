
import express from "express";
import cors from "cors";
import { MongoClient, ObjectId } from 'mongodb';
import 'dotenv/config'
const app = express()

const PORT = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());




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

// Cached MongoDB client (reused across warm lambda invocations on Vercel)
let cachedClient = null;
let cachedDb = null;

export async function connectToMongoDB() {
  if (cachedDb) return cachedDb;

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const client = new MongoClient(process.env.MONGODB_URI);
  await client.connect();
  console.log("You successfully connected to MongoDB!");

  cachedClient = client;
  cachedDb = client.db("assign-8");
  return cachedDb;
}

async function getCollection(name) {
  const db = await connectToMongoDB();
  return db.collection(name);
}




app.get("/event-booking", async (req, res) => {
  try {
    const facilitiesCollection = await getCollection("facilities");
    const result = await facilitiesCollection.find().toArray()
    res.send(result);
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch event bookings" });
  }
})


app.post("/event-booking", async (req, res) => {
  try {
    const facilityData = req.body;
    const facilitiesCollection = await getCollection("facilities");
    const result = await facilitiesCollection.insertOne(facilityData)
    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to create event booking" });
  }
})

app.get("/slicedata", async (req, res) => {
  try {
    const facilitiesCollection = await getCollection("facilities");
    const result = await facilitiesCollection.find().limit(5).toArray()
    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch data" });
  }
})

app.patch("/event-booking/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const facilitiesCollection = await getCollection("facilities");
    const result = await facilitiesCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData },
    );

    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to update event booking" });
  }
})

app.get("/payment2", async (req, res) => {
  try {
    const facilitiesCollection1 = await getCollection("paybill");
    const getPaybill = await facilitiesCollection1.find().toArray()
    res.send(getPaybill)
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to fetch payment data" });
  }
})

app.post("/payment2", async (req, res) => {
  try {
    const body = req.body;
    const facilitiesCollection1 = await getCollection("paybill");
    const result = await facilitiesCollection1.insertOne(body)
    res.send(result)
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: "Failed to save payment data" });
  }
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




app.get("/", (req, res) => {
  res.send({ message: "b14-assignment-8 server is running" });
})


// Only listen locally — Vercel serverless uses the exported app
if (!process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`server is running on the port:${PORT}`)
  })
}

export default app;
