const express = require("express");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

const mongoUrl = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.paph0zm.mongodb.net/?retryWrites=true&w=majority`;

mongoose
  .connect(mongoUrl)
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

require("./schema/userSchema");

const User = mongoose.model("UserInfo");

app.post("/register", async (req, res) => {
  const { email, phone, fullName, password } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.send({ success: false, message: "User already exist" });
    }

    await User.create({
      email,
      phone,
      fullName,
      password: encryptedPassword,
    });
    res.send({ success: true, message: "User successfully registered" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (!userExist) {
      return res.send({ success: false, message: "User does not exist." });
    }

    if (await bcrypt.compare(password, userExist.password)) {
      const token = jwt.sign({}, process.env.JWT_ACCESS_TOKEN_SECRET);

      if (res.status(201)) {
        return res.json({ success: true, message: "Success", data: token });
      } else {
        return res.json({ success: false, message: "Unauthorize" });
      }
    }

    return res.json({ success: false, message: "Invalid password" });
  } catch (error) {
    res.send({ success: false, message: error.message });
  }
});



