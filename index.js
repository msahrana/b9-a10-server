const express = require("express");
const cors = require("cors");
const {MongoClient, ServerApiVersion, ObjectId} = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.crgl3kb.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    const userCollection = client.db("tourismDB").collection("user");
    const spotCollection = client.db("tourismDB").collection("spot");
    const countryCollection = client.db("tourismDB").collection("country");

    /* user api */
    app.get("/user", async (req, res) => {
      const result = await userCollection.find().toArray();
      res.send(result);
    });

    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollection.insertOne(user);
      res.send(result);
    });

    /* spot api */
    app.get("/spot", async (req, res) => {
      const result = await spotCollection.find().toArray();
      res.send(result);
    });

    app.get("/spot/:email", async (req, res) => {
      const email = {email: req.params.email};
      const result = await spotCollection.find(email).toArray();
      res.send(result);
    });

    app.get("/singleSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.find(query).toArray();
      res.send(result);
    });

    app.post("/spot", async (req, res) => {
      const newSpot = req.body;
      const result = await spotCollection.insertOne(newSpot);
      res.send(result);
    });

    app.put("/singleSpot/:id", async (req, res) => {
      const id = req.params.id;
      const filter = {_id: new ObjectId(id)};
      const options = {upsert: true};
      const updatedSpot = req.body;
      const spot = {
        $set: {
          name: updatedSpot.name,
          country: updatedSpot.country,
          location: updatedSpot.location,
          description: updatedSpot.description,
          cost: updatedSpot.cost,
          time: updatedSpot.time,
          visitors: updatedSpot.visitors,
          seasonality: updatedSpot.seasonality,
          email: updatedSpot.email,
          username: updatedSpot.username,
          photoURL: updatedSpot.photoURL,
        },
      };
      const result = await spotCollection.updateOne(filter, spot, options);
      res.send(result);
    });

    app.delete("/singleSpot/:id", async (req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await spotCollection.deleteOne(query);
      res.send(result);
    });

    /* country api */
    app.get("/country", async (req, res) => {
      const result = await countryCollection.find().toArray();
      res.send(result);
    });

    app.post("/country", async (req, res) => {
      const newCountry = req.body;
      const result = await countryCollection.insertOne(newCountry);
      res.send(result);
    });

    await client.db("admin").command({ping: 1});
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tourism Economics server is running");
});

app.listen(port, () => {
  console.log(`Tourism Economics server is running on port: ${port}`);
});
