const express = require("express");
const { addNewHost, getListOfHosts } = require("../../http/controllers/host.controller");
const router = express.Router();


// POST /host/add 
router.post("/add", addNewHost);

//GET/host/list
router.get(
  "/list", getListOfHosts);

module.exports = router;



