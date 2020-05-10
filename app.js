const express = require('express')
const app = express()
const port = 3000
const axios = require('axios');

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const url = 'mongodb://localhost:27017/fishfinder';
const dbName = 'fishfinder';
 


var cors = require('cors');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded()); //Parse URL-encoded bodies

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  console.log("Database created!");
  db.close();
});

app.get('/allFish', async(req,res) =>{
    try{  
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db("fishfinder");
            dbo.collection("fish").find({}).toArray(function(err, result) {
              if (err) throw err;
              console.log(result)
              res.json({fish: result});
              db.close();
            });
          });
    }
    catch(err){
        console.log(err)
    }   
})


//here we will add a fish to the db
app.post('/addFish', (req,res)=>{
    console.log(req.body)

    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db("fishfinder");
        var newFish = { coords: req.body.coords,  date: req.body.date, species: req.body.species };
        dbo.collection("fish").insertOne(newFish, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
          db.close();
        });
      });
})




app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))