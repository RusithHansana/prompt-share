import { Schema, model, models } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    unique: [true, "Emaiil already exists!"],
    required: [true, "Email is required!"],
  },
  username: {
    type: String,
    required: [true, "Username is required!"],
  },
  image: {
    type: String,
  },
});

// Models keeps a record of all the created models
//By using this approach we prevent defining the model every time we need it
const User = models.User || model("User", userSchema);

export default User;
