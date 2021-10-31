const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2ffsd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db('megaBooking');
    const destinationsCollection = database.collection('destinations');
    const usersCollection = database.collection('users');

    // add a destination

    app.post('/destination', async (req, res) => {
      const postDestination = req.body;
      const postResult = await destinationsCollection.insertOne(
        postDestination
      );
      res.json(postResult);
    });
    // GET all destinations

    app.get('/destinations', async (req, res) => {
      const cursor = destinationsCollection.find({});
      const allDestinations = await cursor.toArray();
      res.json(allDestinations);
    });

    // get single destination for placeorder

    app.get('/destinations/:placeOrderId', async (req, res) => {
      const orderId = req.params.placeOrderId;

      const placeOrderQuery = { _id: ObjectId(orderId) };
      const result = await destinationsCollection.findOne(placeOrderQuery);
      res.json(result);
    });

    // GET single user all destinations

    app.get('/user/destinations/:email', async (req, res) => {
      const loggedUserEmail = req.params.email;

      const query = { email: loggedUserEmail };

      const getUserInfo = await usersCollection.find(query).toArray();
      console.log(getUserInfo);
      res.json(getUserInfo);
    });
    // GET single user single destinations

    app.get('/events/:destinationId', async (req, res) => {
      const singleDestinationId = req.params.destinationId;

      const query = { _id: ObjectId(singleDestinationId) };

      const result = await destinationsCollection.findOne(query);
      res.json(result);
    });
    // delete single user deestination

    app.delete('/userDestination/:id', async (req, res) => {
      const deleteId = req.params.id;
      console.log(deleteId);
      const deleteQuery = { _id: ObjectId(deleteId) };
      const result = await usersCollection.deleteOne(deleteQuery);
      res.json(result);
    });

    // ADD or UPDATE  user info

    app.post('/newdestination', async (req, res) => {
      const updatedUserInfo = req.body;

      const userPostResult = await usersCollection.insertOne(updatedUserInfo);

      res.json(userPostResult);
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

client.connect((err) => {
  //   const collection = client.db('test').collection('devices');
  //   client.close();
});

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at vs code dsdsasda ${port}`);
});

// tYoy3JREwYOeTNbH;
