import userModel from "../models/user.model.js";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const registerUser = async(req, res)=>{
    try {
        const {username, email, password} = req.body
        if(!username || !email || !password){
           return res.status(400).json({
                message: "All fields required"
            })
        }
         const existedUser = await userModel.findOne({
            $or: [{ email }, { username }]
        });
        if(existedUser) {
          return  res.status(409).json({
                message: "User already exist"
            })
        }
            const hash =  await bcrypt.hash(password, 10)

        const user = await userModel.create({
            username,
            email,
            password: hash
        })

            const token = jwt.sign(
                {id: user._id, username: user.username},
                process.env.JWT_SECRET,
                {expiresIn : "1d"}
            )

            res.cookie("token", token)

            return res.status(201).json({
                message: "User registered successfully",
                token,
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email
                }
            })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
}
const loginUser = async(req, res)=>{
    try {
        const {email, password} = req.body

        if(!email || !password){
           return res.status(400).json({
                message: "Email and password required"
            })
        }
        const user = await userModel.findOne({email});
        if(!user) {
           return res.status(404).json({
                message: "User not found"
            })
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password)
        if(!isPasswordCorrect){
          return res.status(401).json({
                message: "Invalid password"
            })
        }
         const token = jwt.sign(
                {id: user._id, username: user.username},
                process.env.JWT_SECRET,
                {expiresIn : "1d"}
            )

            res.cookie("token", token, {
             httpOnly: true,
             secure: process.env.NODE_ENV === "production",
             sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });

           return res.status(200).json({
             message: "Login successfully",
                token,
                 user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                    }
        })

        localStorage.setItem(
  "user",
  JSON.stringify(response.data.user)
);

    const token =
  req.cookies?.token ||
  req.header("Authorization")?.replace("Bearer ", "");


        
    } catch (error) {
        return res.status(500).json({
                message: error.message
            })
    }
}
const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            success: true,
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
};

export {registerUser,
        loginUser,
        logoutUser
}