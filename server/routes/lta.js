import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const BASE_URL =
    "https://datamall2.mytransport.sg/ltaodataservice";

// <-- ONLY ONE busStops route
router.get("/busStops", async (req, res) => {

    try {

        console.log("Downloading all bus stops...");

        let allStops = [];
        let skip = 0;

        while (true) {

            const response = await axios.get(
                `${BASE_URL}/BusStops?$skip=${skip}`,
                {
                    headers: {
                        AccountKey: process.env.LTA_API_KEY,
                        accept: "application/json"
                    }
                }
            );

            const stops = response.data.value;

            allStops.push(...stops);

            console.log(`Downloaded ${allStops.length} bus stops...`);

            if (stops.length < 500)
                break;

            skip += 500;
        }

        const clementiStops = allStops.filter(stop =>
            stop.Latitude >= 1.311 &&
            stop.Latitude <= 1.319 &&
            stop.Longitude >= 103.761 &&
            stop.Longitude <= 103.769
        );

        console.log(`Found ${clementiStops.length} bus stops`);

        res.json(clementiStops);

    } catch (error) {

        console.log(error.message);

        res.status(500).json({
            error: error.message
        });

    }

});


router.get("/busArrival/:busStopCode", async (req, res) => {

    try {

        const busStopCode = req.params.busStopCode;

        console.log(`Getting arrivals for ${busStopCode}...`);

        console.log(`${BASE_URL}/BusArrivalv2?$BusStopCode=${busStopCode}`);
        const response = await axios.get(
            `${BASE_URL}/v3/BusArrival`,
            {
                headers: {
                    AccountKey: process.env.LTA_API_KEY,
                    accept: "application/json"
                },
                params: {
                    BusStopCode: busStopCode
                }
            }
        );

        console.log(`${BASE_URL}/v3/BusArrival?BusStopCode=${busStopCode}`);

        res.json(response.data);

    } catch (error) {

        console.log("======================");
        console.log("BUS ARRIVAL ERROR");
        console.log("======================");

        if (error.response) {

            console.log("Status:", error.response.status);
            console.log(error.response.data);

            return res
                .status(error.response.status)
                .json(error.response.data);
        }


        res.status(500).json({
            error: error.message
        });

    }

});

export default router;