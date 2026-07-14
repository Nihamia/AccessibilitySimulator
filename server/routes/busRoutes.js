import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const BASE_URL =
    "https://datamall2.mytransport.sg/ltaodataservice";

router.get("/busRoutes", async (req, res) => {

    try {

        console.log("Downloading bus routes...");

        let allRoutes = [];
        let skip = 0;

        while (true) {

            const response = await axios.get(
                `${BASE_URL}/BusRoutes?$skip=${skip}`,
                {
                    headers: {
                        AccountKey: process.env.LTA_API_KEY,
                        accept: "application/json"
                    }
                }
            );

            const routes = response.data.value;

            allRoutes.push(...routes);

            console.log(`Downloaded ${allRoutes.length} routes...`);

            if (routes.length < 500)
                break;

            skip += 500;

        }

        console.log(`Total routes: ${allRoutes.length}`);

        res.json(allRoutes);

    } catch (error) {

        if (error.response) {

            console.log("Status:", error.response.status);
            console.log(error.response.data);

            return res.status(error.response.status).json(error.response.data);

        }

        console.log(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});

export default router;