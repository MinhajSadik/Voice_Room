import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import connectDB from "./database/mdb.js";
import authRoute from "./routes/auth.route.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.use("/api/user", authRoute);

app.all("/", (req, res) => {
  res.send("Hello from voice room!");
});

app.get("*", (req, res) => {
  res.send("Nothing found here!");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
