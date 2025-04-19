import express from "express";
import cors from "cors";
import { router as chatRouter, wss } from "./routes/Chat.js";
import { pool } from "./db.js"; // Import db.js, assuming you are using it in some way
import mapSelectionRouter from "./routes/MapSelection.js";
import orderRouter from "./routes/Order.js";
import registerPersonalRouter from "./routes/RegisterPersonal.js";
import registerVehicleRouter from "./routes/RegisterVehicle.js";
import loginRouter from "./routes/login.js";

const app = express();

// Enable CORS
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Routes
app.use("/api/map", mapSelectionRouter);
app.use("/api/orders", orderRouter);
app.use("/api/chat", chatRouter);
app.use("/api/drivers", registerPersonalRouter);
app.use("/api/vehicles", registerVehicleRouter);
app.use("/api/auth", loginRouter);

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

export default app; // Export app to be used for testing or other purposes
