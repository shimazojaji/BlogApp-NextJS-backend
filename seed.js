require("dotenv").config();
const mongoose = require("mongoose");
mongoose.set("strictQuery", false); // or true to suppress deprecation
const HostData = require("./data/db.host.json")
// const GuestData = require("./data/db.guest.json");
// const PvUser=require("./data/db.users.json");
const Application = require("./app/server");
const { HostModel } = require("./app/models/host");



(async () => {
  new Application();
  /*  await EskanModel.insertMany(eskanData);
   await MizbanModel.insertMany(mizbanData); */
  // await GuestModel.insertMany(GuestData);
  // await PrivateUserModel.insertMany(PvUser)
  await HostModel.insertMany(HostData);
})()
  .then(() => {
    console.log("DATA INSERTED SUCCESSFULLY.");
    console.log("NOW RUN npm run dev AND TEST THE APIs");
  })
  .catch((err) => console.log("DATA INSERTION FAILED: ", err));

