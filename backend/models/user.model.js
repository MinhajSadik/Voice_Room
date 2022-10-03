import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    phone: {
      type: String,
      required: true,
    },
    activated: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
