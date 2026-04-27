import "dotenv/config";
import "./db/dbConnection.js"
import express from "express";
import route from "./Routes/customer.route.js";
import cors from "cors";
const app = express();
app.use(
  cors({
    origin: "*",
  }),
);
app.use(express.json())
app.use("/customer", route);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
