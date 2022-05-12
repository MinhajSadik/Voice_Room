require("dotenv").config();
const express = require("express");
const cors = require("cors");
const routes = require("./routes");
const DbConnect = require("./database");

const corsOptions = {
  credentials: true,
  origin: ["http://localhost:3000"],
};

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(routes);
const PORT = process.env.PORT || 5000;
DbConnect();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
