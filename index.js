const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// middleware
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World");
});

const uri =
  "mongodb+srv://practiceCoffee:6tOUvpJsRY4iMpCm@cluster0.0rmazcr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const database = client.db("practiceCoffeeDB");
    const practiceCoffeeCollection = database.collection("practiceCoffee");

    // data create
    app.post("/coffees", async (req, res) => {
      const newCoffees = req.body;
      console.log(newCoffees);
      const result = await practiceCoffeeCollection.insertOne(newCoffees);
      res.send(result);
    });

    // data read
    app.get("/coffees", async (req, res) => {
      const result = await practiceCoffeeCollection.find({}).toArray();
      res.send(result);
    });

    // data read by id
    app.get("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await practiceCoffeeCollection.findOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // data delete
    app.delete("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const result = await practiceCoffeeCollection.deleteOne({
        _id: new ObjectId(id),
      });
      res.send(result);
    });

    // data update
    app.put("/coffees/:id", async (req, res) => {
      const id = req.params.id;
      const updateCoffee = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const coffee = {
        $set: {
          name: updateCoffee.name,
          chef: updateCoffee.chef,
          supplier: updateCoffee.supplier,
          taste: updateCoffee.taste,
          category: updateCoffee.category,
          details: updateCoffee.details,
          photo: updateCoffee.photo,
        },
      };
      const result = await practiceCoffeeCollection.updateOne(
        filter,
        coffee,
        options
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
