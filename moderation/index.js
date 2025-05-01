const express = require("express");
const axios = require("axios");

const app = express();

app.use(express.json());

const handleEvent = async (type, data) => {
  if (type === "CommentCreated") {
    // Simulate moderation logic
    const status = data.content.includes("orange") ? "rejected" : "approved";

    // Emit the event to the event bus
    await axios.post("http://event-bus-serv:4005/events", {
      type: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }
};

app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  await handleEvent(type, data);

  res.send({});
});

app.listen(4003, async () => {
  console.log("Moderation service is running on port 4003");

  try {
    const res = await axios.get("http://event-bus-serv:4005/events");

    for (let event of res.data) {
      console.log("Processing event:", event.type);
      await handleEvent(event.type, event.data);
    }
  } catch (err) {
    console.log("Error fetching events:", err.message);
  }
});
