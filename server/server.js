import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import ltaRoutes from "./routes/lta.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api", ltaRoutes);

app.get("/", (req, res) => {
    res.send("🔥 THIS IS THE NEW EXPRESS SERVER 🔥");
});

const PORT = 3000;

app.listen(PORT, () => {

    console.log(`Server running on http://localhost:${PORT}`);

});