const express = require("express");
const router = express.Router();
const path = require("node:path");

// path to data file
const recipeFile = path.join(__dirname, "../data/recipes.json");

const recipes = require(recipeFile);

router
.route('/recipes')
.get((_req, res)=>{
    res.status(200).json(recipes)
})

module.exports = router;