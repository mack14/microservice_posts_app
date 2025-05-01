const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);

  // Send the event to the other services
  axios
    .post("http://posts-cluster-ip-serv:4000/events", event)
    .catch((err) => console.log(err.message));
  axios
    .post("http://comments-cluster-ip-serv:4001/events", event)
    .catch((err) => console.log(err.message));
  axios
    .post("http://query-cluster-ip-serv:4002/events", event)
    .catch((err) => console.log(err.message));

  axios
    .post("http://moderation-cluster-ip-serv:4003/events", event)
    .catch((err) => console.log(err.message));

  res.send({ status: "OK" });
});

// Get all events
app.get("/events", (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  console.log("Event bus is running on port 4005");
});
