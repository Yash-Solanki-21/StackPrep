import mongoose from "mongoose";

async function connectToDB(){
    try {   
        await mongoose.connect(process.env.MONGO_URL)
        console.log("Connected to Database")
    } catch (error) {
       console.log("Database connection failed", error) 
    }
}

export {connectToDB}