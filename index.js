const jwt = require('jsonwebtoken');
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const cookieParser = require('cookie-parser');
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'https://foodies-restaurant-server-qbfedtxj6.vercel.app', 'https://foodies-restaurant-client.vercel.app'],
  credentials: true
}));
app.use(express.json()); // Ensure you can parse JSON requests
app.use(cookieParser()); //


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ebsbi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// Connect to MongoDB and set up routes
async function run() {
  try {
    // Connect the client to the server

    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );

    const menuCollection = client.db("Foodies").collection("menu");
    const bookingsCollection = client.db("Foodies").collection("bookings");


    //auth
    app.post('/jwt' , async(req, res) => {
      const user = req.body;
      console.log(process.env.ACCESS_TOKEN_SECRET);
      const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET , {expiresIn: '1h'})
      res
      .cookie('token', token, {
        httpOnly: true,
        secure: false,
      })
      .send({success: true});

    })

    app.post("/bookings", async (req, res) => {
      const bookings = req.body;

    } )

    app.get("/menu", async (req, res) => {
      try {
        const cursor = menuCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).send("Error fetching menu");
      }
    });

    app.get('/menu/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) }
        const result = await menuCollection.findOne(query);
        res.send(result);


      } catch (error) {
        console.error("Error fetching menu:", error);
        res.status(500).send("Error fetching menu item");
      }
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}

// Start the server and connect to MongoDB
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.listen(port, () => {
  console.log("Listening on port", port);
});
