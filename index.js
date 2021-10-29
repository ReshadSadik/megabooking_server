const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;

const uri =
  'mongodb+srv://megaBooking:Ax3sIFNQagU6Wj3P@cluster0.2ffsd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
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

    // POST an event

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

    // GET single user destinations

    app.get('/user/destinations/:email', async (req, res) => {
      const loggedUserEmail = req.params.email;
      // const loggedUserInfo = req.body;
      const query = { userEmail: loggedUserEmail };
      const getUserInfo = await usersCollection.findOne(query);
      const query2 = getUserInfo.userDestinationId;

      const results = [];
      for (const des of query2) {
        const query3 = { _id: ObjectId(des) };
        const newResult = await destinationsCollection.findOne(query3);
        results.push(newResult);
      }

      const result = await destinationsCollection.find(query2);
      // console.log(results);
      res.json(results);
    });

    // ADD or UPDATE  user info

    app.put('/newdestination', async (req, res) => {
      const updatedUserInfo = req.body;

      const query = { userEmail: updatedUserInfo.email };

      const userInformation = (await usersCollection.findOne(query)) || {};

      const filter = { userEmail: updatedUserInfo.email };

      const options = { upsert: true };

      let newAddedDestinations = [];
      if (userInformation.userEmail) {
        newAddedDestinations = [
          ...userInformation.userDestinationId,
          updatedUserInfo.destinationId,
        ];
      } else {
        newAddedDestinations = [updatedUserInfo.destinationId];
      }

      const updateDoc = {
        $set: {
          userEmail: updatedUserInfo.email,
          userDestinationId: newAddedDestinations,
        },
      };

      const updateResult = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(updateResult);
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
  console.log(`Example app listening at ${port}`);
});

// tYoy3JREwYOeTNbH;
