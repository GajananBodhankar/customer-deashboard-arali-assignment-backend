import mongoose from "mongoose";
mongoose
  .connect(process.env.MONGOOSE_URL, {})
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));
