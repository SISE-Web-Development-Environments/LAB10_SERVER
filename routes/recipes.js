const express = require("express");
const router = express.Router();
const _ = require("lodash");
const utils = require("../local/utils");
console.log(utils);

router.get("/random", (req, res, next) => {
  try {
    const recipes = utils.read_recipes();
    const random_recipes = _.sampleSize(recipes, 3);
    res.status(200).send({
      message: "Function succeeded",
      success: true,
      recipes: random_recipes
    });
  } catch (error) {
    next(error);
  }
});

router.get("/allId", async (req, res, next) => {
  try {
    let recipes = utils.read_recipes();
    recipes = recipes.map((r) => r.id);

    res.status(200).send({
      message: "Function succeeded",
      success: true,
      recipes: recipes
    });
  } catch (error) {
    next(error);
  }
});

router.get("/info", async (req, res, next) => {
  try {
    const recipes = utils.read_recipes_info();
    let recipe = recipes.find((r) => String(r.id) === String(req.query.id));
    if (recipe === undefined)
      throw { status: 404, message: "recipe not found" };
    res.status(200).send({
      message: "Function succeeded",
      success: true,
      recipe: recipe
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
