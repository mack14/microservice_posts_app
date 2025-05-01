const express = require("express");
const { randomBytes } = require("crypto");
const cors = require("cors");
const axios = require("axios");
const { type } = require("os");

const app = express();

const posts = {};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/posts", (req, res) => {
  res.send(posts);
});

app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");

  const { title } = req.body;
  posts[id] = {
    id,
    title,
  };

  // emitting the event to the event bus
  await axios.post("http://event-bus-serv:4005/events", {
    type: "PostCreated",
    data: {
      id,
      title,
    },
  });

  res.status(201).send(posts[id]);
});

// Event bus listener
app.post("/events", async (req, res) => {
  console.log("Event received:", req.body.type);
  res.send({});
});

app.listen(4000, () => {
  console.log("versions coming soon");
  console.log("Post-service is running on port 4000");
});
