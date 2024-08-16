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

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, "public")));

// Handle socket connections
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

// Use the port assigned by Heroku, default to 5000 if not set
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
