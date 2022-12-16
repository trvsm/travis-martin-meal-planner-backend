// import path first to support dotenv, dotenv used to support variables based on code environment
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const express = require("express");
const fs = require("node:fs");
const axios = require("axios");
const cors = require('cors');

const app = express();

app.use(express.json());

const recipeRouter = require('./routes/recipes.js');

const arraySeparator = ",";
// function to add bits to array to separate objects while writing
const syntaxInsertions = (insertion) => {
  fs.appendFile(mealFile, insertion, (err) => {
    if (err) {
      console.log(err);
    }
  });
};

const mealFile = path.join(__dirname, "./data/recipes.json");

// meal DB 1 random meal: www.themealdb.com/api/json/v1/1/random.php?api_key=1

// model to build test json recipe list
const buildJSON = (targetURL) => {
  syntaxInsertions("[");
  for (i = 0; i < 15; i++) {
    axios.get(targetURL).then((response) => {
      console.log(response.data);
      fs.appendFile(mealFile, JSON.stringify(response.data), (err) => {
        if (err) console.log(err);
      });
    });
    // syntaxInsertions(",");
  }
//   syntaxInsertions("]");
};

/* ****NOTE: uncomment line below and run to make api call for more recipes**** */
// buildJSON(`http://www.themealdb.com/api/json/v1/1/random.php?api_key=1`);

app.use(cors());

app.use('/', recipeRouter)

const PORT = process.env.PORT || 1024;
app.listen(PORT, () => {
  console.log(`Server running, port ${PORT}`);
});
