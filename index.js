//#region express configures
var express = require("express");
var logger = require("morgan");
const session = require("client-sessions");
var cors = require("cors");

var app = express();
app.use(logger("dev")); //logger
app.use(express.json()); // parse application/json
app.use(cors());
app.options("*", cors());
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

//#region cookie middleware
app.use(function (req, res, next) {
  if (req.session && req.session.user_id) {
    DButils.execQuery("SELECT user_id FROM users")
      .then((users) => {
        if (users.find((x) => x.user_id === req.session.user_id)) {
          req.user_id = req.session.user_id;
        }
        next();
      })
      .catch((error) => next());
  } else {
    next();
  }
});
//#endregion

app.get("/", (req, res) => res.send("hello world"));

const user = require("./routes/user");
const recipes = require("./routes/recipes");

app.use("/user", user);
app.use("/recipes", recipes);

// app.post("/user/Register", (req, res, next) => {
//   try {
//     const users = utils.read_users();
//     if (users.find((x) => x.username === req.body.username))
//       throw { status: 400, message: "Name exists" };
//     var newUser = { id: users.length, ...req.body };
//     utils.write_user(newUser);
//     res.status(201).send({ message: "user created", success: true });
//   } catch (error) {
//     next(error);
//   }
// });
// app.post("/user/Login", (req, res, next) => {
//   try {
//     const users = utils.read_users();
//     const user = users.find((x) => x.name === req.body.name);
//     if (!user)
//       throw { status: 401, message: "password or Name is not correct" };
//     if (req.body.password !== user.password) {
//       throw { status: 401, message: "password or Name is not correct" };
//     }

//     req.session.user_id = user.id;
//     res.status(200).send({ message: "login succeeded", success: true });
//   } catch (error) {
//     next(error);
//   }
// });

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
