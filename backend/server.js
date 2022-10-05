import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./database/mdb.js";
import userRoute from "./routes/user.route.js";

dotenv.config();

const options = {
  origin: ["http://localhost:3000"],
  credentials: true,
};
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use("/storage", express.static("storage"));
app.use(morgan("dev"));
app.use(cors(options));

connectDB();

app.use("/api/user", userRoute);

app.all("/", (req, res) => {
  res.json("Hello from voice room!");
});

app.get("*", (req, res) => {
  res.json("Nothing found here!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
