import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

const Remote_Url = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pu4qt.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const Local_Url = `mongodb://127.0.0.1:27017/${process.env.DB_NAME}`;
const DB_URL = process.env.NODE_ENV === "production" ? Remote_Url : Local_Url;

async function connectDB() {
  const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };

  try {
    mongoose.connect(DB_URL, options);
    console.log(`Database Connected with url: ${Local_Url}`);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export default connectDB;
