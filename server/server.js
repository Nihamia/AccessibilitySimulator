import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ltaRoutes from "./routes/lta.js";
import busRoutesRouter from "./routes/busRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", ltaRoutes);
app.use("/api", busRoutesRouter);

app.get("/", (req, res) => {
    res.send("🔥 THIS IS THE NEW EXPRESS SERVER 🔥");
});

app.listen(3000, () => {
    console.log("Server running on http://localhost:3000");
});