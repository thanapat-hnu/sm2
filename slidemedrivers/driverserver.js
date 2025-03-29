import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import { pool } from "./db.js";

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

app.use("/drivers", routes);

app.listen(process.env.MYSERVER_PORT,process.env.MYSERVER_HOST, () => {
    console.log(`Server is running on http://${process.env.MYSERVER_HOST}:${process.env.MYSERVER_PORT}`);
});