const express = require("express");
const path = require("path");

const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*", // Adjust as needed for security
    methods: ["GET", "POST"],
  },
});

app.use(express.static(path.join(__dirname, "public")));

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("newuser", (username) => {
    socket.broadcast.emit("update", `${username} joined the conversation`);
  });

  socket.on("chat", (message) => {
    socket.broadcast.emit("chat", message);
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

server.listen(5000, () => {
  console.log("Server is listening on port 5000");
});
