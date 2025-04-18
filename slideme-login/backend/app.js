const express = require("express");
const cors = require("cors");
const { router: chatRouter, wss } = require("./routes/Chat");
const app = express();

require("./db.js");
// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Routes
const mapSelectionRouter = require("./routes/MapSelection");
app.use("/api/map", mapSelectionRouter);

const orderRouter = require("./routes/Order");
app.use("/api/orders", orderRouter);

app.use("/api/chat", chatRouter);

app.use("/api/drivers", require("./routes/RegisterPersonal"));
// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle WebSocket upgrade
server.on("upgrade", (request, socket, head) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit("connection", ws, request);
  });
});

module.exports = app;
