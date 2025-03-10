const express = require("express");
const app = express();
const path = require("path");

const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

io.on("connection", (socket) => {
    console.log("A client connected:", socket.id);

    // Listen for location updates
    socket.on("send-location", (data) => {
        console.log("Received location from client:", data);
        io.emit("receive-location", { id: socket.id, ...data }); // Broadcast location
    });

    socket.on("disconnect", () => {
        console.log("A client disconnected:", socket.id);
        io.emit("user-disconnected",socket.id);
    });
});

app.get("/", (req, res) => {
    res.render("index");
});

server.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
