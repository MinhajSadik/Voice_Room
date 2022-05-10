require("dotenv").config();
const express = require("express");

const server = express();
const PORT = process.env.PORT || 5000;

server.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
