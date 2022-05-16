// const express = require("express");
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
const app = express();
require("dotenv").config();
const jwt = require("jsonwebtoken");
const upload = require("multer")();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:3300" }));

const userData = {
  username: "admin",
  password: "admin",
};

function auth(req, res, next) {
  const token = req.headers["authorization"].split(" ")[1];

  if (token === "null") return res.sendStatus(401);

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
  });
  next();
}

app.post("/login", upload.none(), (req, res) => {
  console.log(req.body);
  if (
    req.body.username === userData.username &&
    req.body.password === userData.password
  ) {
    const token = jwt.sign(
      { username: userData.username },
      process.env.JWT_SECRET
    );

    return res.json({ token: token });
  } else {
    return res.status(401).json("fail");
  }
});

app.get("/get-sync-data", auth, (req, res) => {
  const queryString = `
SELECT "EmployeeID", "FirstName" , "LastName", "Address" from employees`;
  pool.query(queryString, (err, data) => {
    console.log("err", err);
    if (err) return res.sendStatus(500);
    return res.json(data.rows);
  });
});

const listener = app.listen(process.env.PORT || 5000, () => {
  console.log("server running on port " + listener.address().port);
});
