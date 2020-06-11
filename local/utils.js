const path = require("path");
var fs = require("fs");

module.exports = {
  read_recipes: function () {
    const data = fs.readFileSync(path.join(__dirname, "/recipes.json"));
    return JSON.parse(data);
  },
  read_recipes_info: function () {
    const data = fs.readFileSync(path.join(__dirname, "/recipesInfo.json"));
    return JSON.parse(data);
  }
};
