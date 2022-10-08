import { model, Schema } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: false,
    },
    avatar: {
      type: String,
      required: false,
      get: (avatar) => {
        console.log(avatar);
        if (avatar) {
          return `${process.env.BASE_URL}${avatar}`;
        }
        return avatar;
      },
    },
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
    toJSON: { getters: true },
  }
);

const User = model("User", userSchema);

export default User;
