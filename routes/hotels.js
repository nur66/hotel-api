import express from "express";
import { createHotel, deleteHotel, getHotel, getsHotel, updateHotel } from "../controllers/hotel.js";
import Hotel from "../models/Hotel.js"; // pakai ekstensi
import { createError } from "../utils/errors.js";

const router = express.Router();

// CREATE
router.post("/", createHotel);

// UPDATE
router.put("/:id", updateHotel);

// DELETE
router.delete("/:id", deleteHotel);

// GET
router.get("/:id", getHotel);

// GET ALL
router.get("/", getsHotel);

export default router;
