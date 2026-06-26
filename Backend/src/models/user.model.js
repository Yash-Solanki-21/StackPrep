import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

    username:{
        type : String,
        unique: [true, "Username already taken"],
        required : true,
    },

    email: {
        type : String,
        unique: [true, "Account already exist with is email address"],
        requierd: true,
    },
    password: {
        type: String,
        required: true, 
    },
     role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  }
     
}, { timestamps: true });

const userModel = mongoose.model("user", userSchema);

export default userModel