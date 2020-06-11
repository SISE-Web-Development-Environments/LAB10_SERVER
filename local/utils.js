const path = require("path");
var fs = require("fs");

exports = {
  // read_users: function () {
  //   const data = fs.readFileSync(path.join(__dirname, "/db.json"));
  //   return JSON.parse(data).users;
  // },
  // write_user: function (user) {
  //   let data = fs.readFileSync(path.join(__dirname, "/db.json"));
  //   data = JSON.parse(data);
  //   data.users.push(user);
  //   fs.writeFileSync(path.join(__dirname, "/db.json"), JSON.stringify(data));
  // },
  read_recipes: function () {
    const data = fs.readFileSync(path.join(__dirname, "/recipes.json"));
    return JSON.parse(data);
  },
  read_recipes_info: function () {
    const data = fs.readFileSync(path.join(__dirname, "/recipesInfo.json"));
    return JSON.parse(data);
  }
};
