const _ = require("lodash");
//#region express configures
var express = require("express");
var logger = require("morgan");
const session = require("client-sessions");
const path = require("path");
var fs = require("fs");
var cors = require("cors");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(cors());
// app.use(
//   cors({
//     origin: "http://127.0.0.1:5500"
//   })
// );

app.use(
  session({
    cookieName: "session", // the cookie key name
    secret: "super_secret", // the encryption key
    duration: 20 * 60 * 1000, // expired after 20 sec
    activeDuration: 0 // if expiresIn < activeDuration,
    //the session will be extended by activeDuration milliseconds
  })
);
var port = process.env.PORT || "3000";
//#endregion

const utils = {
  read_users: function () {
    const data = fs.readFileSync(path.join(__dirname, "/db.json"));
    return JSON.parse(data).users;
  },
  write_user: function (user) {
    let data = fs.readFileSync(path.join(__dirname, "/db.json"));
    data = JSON.parse(data);
    data.users.push(user);
    fs.writeFileSync(path.join(__dirname, "/db.json"), JSON.stringify(data));
  },
  read_recipes: function () {
    const data = fs.readFileSync(path.join(__dirname, "/recipes.json"));
    return JSON.parse(data);
  },
  read_recipes_info: function () {
    const data = fs.readFileSync(path.join(__dirname, "/recipesInfo.json"));
    return JSON.parse(data);
  }
};

app.get("/", (req, res) => res.send("hello world"));

app.post("/user/Register", (req, res, next) => {
  try {
    const users = utils.read_users();
    if (users.find((x) => x.username === req.body.username))
      throw { status: 400, message: "Name exists" };
    var newUser = { id: users.length, ...req.body };
    utils.write_user(newUser);
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});
app.post("/user/Login", (req, res, next) => {
  try {
    const users = utils.read_users();
    const user = users.find((x) => x.name === req.body.name);
    if (!user)
      throw { status: 401, message: "password or Name is not correct" };
    if (req.body.password !== user.password) {
      throw { status: 401, message: "password or Name is not correct" };
    }

    req.session.user_id = user.id;
    res.status(200).send({ message: "login succeeded", success: true });
  } catch (error) {
    next(error);
  }
});

app.get("/recipes/random", (req, res, next) => {
  try {
    const recipes = utils.read_recipes();
    const random_recipes = _.sampleSize(recipes, 3);
    res.status(200).send({
      message: "login succeeded",
      success: true,
      recipes: random_recipes
    });
  } catch (error) {
    next(error);
  }
});

app.get("/recipes/allId", async (req, res, next) => {
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

app.get("/recipes/info", async (req, res, next) => {
  try {
    const recipes = utils.read_recipes_info();
    let recipe = recipes.find((r) => String(r.id) === String(req.query.id));

    res.status(200).send({
      message: "Function succeeded",
      success: true,
      recipe: recipe
    });
  } catch (error) {
    next(error);
  }
});

app.use(function (err, req, res, next) {
  console.error("\x1b[31m", "error message:", err.message);
  res.status(err.status || 500).send({ message: err.message, success: false });
});

const server = app.listen(port, () => {
  console.log(`Server listen on port ${port}`);
});

process.on("SIGINT", function () {
  if (server) {
    server.close(() => console.log("server closed"));
  }
  process.exit();
});
