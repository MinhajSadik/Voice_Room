require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const DbConnect = require("./database");
const cookieParser = require("cookie-parser");

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
  // allowedHeaders: ["Content-Type"],
};

const app = express();
app.use(cookieParser());
app.use(express.json({ limit: "8mb" }));
app.use(cors({ origin: "http://localhost:3000" }));
app.use("/storage", express.static("storage"));
app.use(routes);
const PORT = process.env.PORT || 5000;
DbConnect();

app.get("/", (req, res) => {
  res.send("Hello Coders House Voice Room");
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
