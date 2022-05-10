require("dotenv").config();
const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.json());
app.use(routes);
const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Hello from app!");
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
