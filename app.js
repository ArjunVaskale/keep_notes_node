const express = require("express");
const app = express();
const conn = require("./config/database");
const cors = require("cors");

const signup = require("./requests/signup.js");

const jwt = require("jsonwebtoken");

app.use(cors());
app.use(express.json());

let bcrypt = require("bcryptjs");

const Notes = require("./model/notes");
const Users = require("./model/users");
const { collection } = require("./model/notes");
conn();

app.post("/signup", async (req, resp) => {
  signup(req, resp, Users, bcrypt, jwt);
});

app.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  const isUserExists = await Users.findOne({ email: email });
  if (isUserExists) {
    const checkPassword = await bcrypt.hash(password, 8);

    if (bcrypt.compareSync(password, isUserExists.password)) {
      const token = jwt.sign(
        { user_id: isUserExists._id, email },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "2h" }
      );
      return res.json({ email: email, token: token });
    } else {
      return res.status(400).send({
        message: "Wrong password.",
      });
    }
  } else {
    return res.status(400).send({
      message: "Invalid email address.",
    });
  }
});

app.get("/", async (req, res) => {
  return res.send("Server is working !!!");
});

app.get("/alldata", async (req, res) => {
  try {
    jwt.decode(req.headers.token);
  } catch (err) {
    console.log("Catch Error", err);
    return res.send("Invalid Token.");
  }
  const isExpired = jwt.decode(req.headers.token);
  if (!isExpired) {
    return res.send("Invalid Token.");
  }
  if (Date.now() >= isExpired.exp * 1000) {
    return res.send("Expired Token.");
  } else {
    console.log("token not expired");
  }
  Notes.find({}, { note: 1, _id: 1, email: 1 }, (err, data) => {
    if (err) throw err;
    res.json(data);
  });
});

app.get("/userData", async (req, res) => {
  try {
    jwt.decode(req.headers.token);
  } catch (err) {
    return res.send("Invalid Token.");
  }
  const isExpired = jwt.decode(req.headers.token);
  if (!isExpired) {
    return res.send("Invalid Token.");
  }
  if (Date.now() >= isExpired.exp * 1000) {
    return res.send("Expired Token.");
  }
  const data = jwt.decode(req.headers.token);
  Notes.find(
    { email: data.email },
    { note: 1, _id: 1, email: 1, time: 1, date: 1, updated: 1 },
    (err, data) => {
      if (err) throw err;
      res.json(data);
    }
  );
});

app.post("/", (req, res) => {
  const data = jwt.decode(req.headers.token);
  Notes.create(
    {
      note: req.body.item,
      email: data.email,
      date: new Date().toLocaleDateString("en-GB"),
      time: new Date().toLocaleTimeString("en-GB"),
    },
    (err, data) => {
      if (err) return err;
      console.log(data);
    }
  );
  res.status(200).send({ message: `${req.body.item} inserted Succesfully!!!` });
});

app.delete("/delete", (req, res) => {
  console.log(req.body.delId);
  Notes.remove({ _id: req.body.delId }, (err, data) => {
    if (err) return err;
    console.log("data", data);
  });
  res.status(200).send({ message: "Deleted Succesfully!!!" });
});

app.put("/update", (req, res) => {
  console.log(req.body.delId);
  let oldData = { _id: req.body.itemId };
  let newData = { $set: { note: req.body.newNote }, updated: true };
  Notes.updateOne(oldData, newData, (err, data) => {
    if (err) return err;
    console.log("data", data);
  });
  res.status(200).send({ message: "Updated Succesfully!!!" });
});

app.post("/addtwouser", (req, res) => {
  let oldData = { _id: req.body.itemId };
  console.log("oldData==>", oldData);

  Notes.find({ _id: req.body.itemId }, { email: 1 }, (err, data) => {
    if (err) throw err;
    console.log("data==>", data);

    let newData = { $set: { email: [...data[0].email, req.body.email2] } };

    Notes.updateOne(oldData, newData, (err, data) => {
      if (err) return err;
      console.log("data", data);
    });
    res.status(200).send({ message: "email address added !!!" });
  });
});

module.exports = app;
