import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js"; // harus pake extensi
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import usersRoute from "./routes/users.js";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connect to MongoDB");
  } catch (error) {
    throw error;
  }
};

// jika connect di mongo db disconnect (ip address)
mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!");
})

// middleware
app.use(express.json()) // agar bisa menggunakan json di body postmannya

app.use("/api/auth", authRoute) // harus pake slash didepan endpointnya, kalau tidak maka 404
app.use("/api/users", usersRoute)
app.use("/api/hotels", hotelsRoute)
app.use("/api/rooms", roomsRoute)

// error handling yang dilempar dari next
app.use((err,req,res,next) => {
  const errorStatus = err.status || 500
  const errorMessage = err.message || "Something went wrong"
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack
  });
})

app.listen(2311, () => {
  connect();
  console.log(`Server started on port 2311`);
});
