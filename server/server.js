require("dotenv").config();
const express = require("express");
const routes = require("./routes");
const DbConnect = require("./database");

const app = express();
app.use(express.json());
app.use(routes);
const PORT = process.env.PORT || 5000;
DbConnect();

app.get("/", (req, res) => {
  res.send("Hello from server");
});

app.listen(process.env.PORT, () => {
  console.log(`app is running on port ${PORT}`);
});
