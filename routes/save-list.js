const express = require("express");
const router = express.Router();
const path = require("node:path");
const file = require("node:fs");

const savedShoppingLists = path.join(__dirname, "../data/lists.json");

// since index routes this to /save-list, / is the route here
// this would support /save-list/nested etc
router
  .route("/save-list")
  .post((req, res) => {
    // post data becomes req.body
    reqJson = req.body.data;
    res.status(201).json(`new entry:\n${reqJson}`);
    //next write data to database
    file.writeFile(savedShoppingLists, reqJson, (err) => {
      if (err) throw err;
      console.log("write list!");
    });
  })
  .get((_req, res) => {
    res.status(200).json("endpoint exists");
  });

module.exports = router;
