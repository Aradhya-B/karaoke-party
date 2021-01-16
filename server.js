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

server.listen(port, () => console.log(`Listening on port ${port}`));
