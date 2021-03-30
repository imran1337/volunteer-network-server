require("dotenv").config();
const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const port = process.env.PORT || 5000;
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

client.connect((err) => {
  const db = client.db(process.env.DB_NAME);
  const EventsCollection = db.collection(process.env.DB_EVENTS_COLLECTION);
  const VolunteerCollection = db.collection(
    process.env.DB_VOLUNTEER_COLLECTION
  );

  app.post("/register-volunteer", (req, res) => {
    const volunteerInfo = req.body;
    VolunteerCollection.insertOne(volunteerInfo).then((response) => {
      console.log(response);
      if (response.insertedCount < 1) {
        return res.status(500).send({
          success: false,
          msg: "Something went wrong please try again",
        });
      }
      res
        .status(200)
        .send({ success: true, msg: `volunteer added successfully` });
    });
  });

  app.get("/volunteer-full-list", (req, res) => {
    VolunteerCollection.find({}).toArray((error, documents) => {
      res.status(200).send(documents);
    });
  });

  // app.delete("/remove-volunteer", (req, res) => {
  //   const { id } = req.body;
  //   VolunteerCollection.deleteOne({ _id: ObjectId(id) }).then((response) => {

  // });

  app.delete("/remove-volunteer", (req, res) => {
    const { id } = req.body;
    VolunteerCollection.deleteOne({ _id: ObjectId(id) }).then((response) => {
      if (response.deletedCount < 1) {
        return res.status(500).send({
          success: false,
          msg: "Something went wrong please try again",
        });
      }
      return res.status(200).send({
        success: true,
        msg: "deleted successfully",
      });
    });
  });

  // app.post('/add-event',(req,res) => {
  //   console.log(req.body);
  // })

 app.post('/add-event',(req,res) =>  {
   const eventData = req.body;
   EventsCollection.insertOne(eventData).then(response => {
     console.log(response);
   })
 })

  console.log("database connected");
  console.log({ err });
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log(`server running at http://localhost:${port}`);
});
