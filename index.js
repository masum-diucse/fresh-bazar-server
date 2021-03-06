const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
require('dotenv').config()
const ObjectId = require('mongodb').ObjectId;
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kdxcg.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  const productCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_1}`);
  const ordersCollection = client.db(`${process.env.DB_NAME}`).collection(`${process.env.DB_COLLECTION_2}`);

  //--add single product
  app.post('/addProduct', (req, res) => {
    const newProduct = req.body;
    productCollection.insertOne(newProduct)
      .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount > 0)
      })
  })
  //--add order
  app.post('/addOrder', (req, res) => {
    const order = req.body;
    ordersCollection.insertOne(order)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
  })

  //--get all products
  app.get('/getAllProduct', (req, res) => {
    productCollection.find({})
      .toArray((err, products) => {
        res.send(products);
      })
  })

  //--get single product
  app.get('/getSingleProduct/:id', (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  //--get multiple product from order
  app.post('/productByEmail', (req, res) => {
    const userEmail = req.body;
    ordersCollection.find({ userEmail: userEmail[0] })
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  //--delete single product
  app.delete('/deleteProduct/:id', (req, res) => {
    const id = req.params.id;
    productCollection.deleteOne({
      _id: ObjectId(id)
    }).then(result => {
      res.send(result.deletedCount > 0);
    })
  })

  console.log("DB Connected");
});

app.get('/', (req, res) => {
  res.send("Hello from heruko");
})

app.listen(process.env.PORT || 5000);