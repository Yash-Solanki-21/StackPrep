import "dotenv/config"; 
import { app } from "./app.js";
import { connectToDB } from "./src/db/database.js";


connectToDB();

app.listen(process.env.PORT, (req, res) => {
  console.log(`Server running on PORT : ${process.env.PORT}`);
});
