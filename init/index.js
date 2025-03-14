const mongoose = require("mongoose");
const initDb = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() =>{
  console.log("connected to db");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderLust');
}

const insertData = async() =>{
  await Listing.deleteMany({});
   initDb.data = initDb.data.map((obj) =>(
    {...obj, owner: "67d06277aad35960a828058c"}
  ))
  await Listing.insertMany(initDb.data);
  console.log("data initialized");
};

insertData();