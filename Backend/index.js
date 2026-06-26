import "dotenv/config"; 
import { app } from "./app.js";
import { connectToDB } from "./src/db/database.js";

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "StackPrep Backend is running 🚀",
  });
});

connectToDB();

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server running on PORT : ${process.env.PORT}`);
});
