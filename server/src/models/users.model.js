import { Schema, model } from "mongoose";
import cartModel from "./cart.model.js";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    index: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'user', 'premium']
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "products"
  },
});

userSchema.pre("save", async function (next) {
  try {
    const newCart = await cartModel.create({});
    this.cart = newCart._id; 
  } catch (error) {
    next(error);
  }
});

const userModel = model("users", userSchema);

export default userModel;
