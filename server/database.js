const mongoose = require("mongoose");

//db connection
function DbConnect() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  const DB_URL = process.env.DB_URL_COMPUSER;
  mongoose.connect(DB_URL, options);
  const db = mongoose.connection;
  db.on("error", console.error.bind(console, "connection error:"));
  db.once("open", () => {
    console.log("Database Connected...");
  });
}
module.exports = DbConnect;
