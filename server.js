const express = require("express");
const http = require("http");

const port = process.env.PORT || 8080;
const app = express();
const root = require("path").join(__dirname, "client/public");
app.use(express.static(root));
app.get("/", (req, res) => {
  res.sendFile("index.html", { root });
});
const server = http.createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
  },
});

class Member {
  constructor(socketID, name) {
    this.currentScore = 0;
    this.totalScore = 0;
    this.socketID = socketID;
    this.name = name;
  }
}
let members = new Map();

io.on("connection", (socket) => {
  console.log("New Member has joined");

  socket.on("newMember", (socketID, name) => {
    // socketId: {name: name, score:score}
    members.set(name, new Member(socketID, name));

    var newList = [...members.values()];
    console.log(newList);

    setInterval(() => io.emit("updateLeaderBoard", newList), 2000);
  });

  socket.on("newScore", (score) => {
    io.emit("updateMemberScores", score);
  });
});

server.listen(port, () => console.log(`Listening on port ${port}`));
