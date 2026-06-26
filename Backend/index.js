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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
