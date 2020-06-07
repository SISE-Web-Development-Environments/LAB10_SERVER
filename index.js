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

const db = {
  read_users: function () {
    const data = fs.readFileSync(path.join(__dirname, "/db.json"));
    return JSON.parse(data).users;
  },
  write_user: function (user) {
    let data = fs.readFileSync(path.join(__dirname, "/db.json"));
    data = JSON.parse(data);
    data.users.push(user);
    fs.writeFileSync(path.join(__dirname, "/db.json"), JSON.stringify(data));
  }
};

app.get("/", (req, res) => res.send("hello world"));

app.post("/user/Register", (req, res, next) => {
  try {
    const users = db.read_users();
    if (users.find((x) => x.username === req.body.username))
      throw new Error("Name exists");
    var newUser = { id: users.length, ...req.body };
    db.write_user(newUser);
    res.status(201).send({ message: "user created", success: true });
  } catch (error) {
    next(error);
  }
});
app.post("/user/Login", (req, res, next) => {
  try {
    const users = db.read_users();
    const user = users.find((x) => x.name === req.body.name);
    if (!user) throw new Error("password or Name is not correct");
    if (req.body.password !== user.password) {
      throw new Error("password or Name is not correct");
    }

    req.session.user_id = user.id;
    res.status(200).send("login succeeded");
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
