import app from "./app.js";
import dotenv from "dotenv";
import mongoose from "mongoose";
dotenv.config();

mongoose
  .connect(process.env.DATA_BASE)
  .then(() => {
    console.log('DATA BASE connected')
  })
  .catch((err) => {
    console.log(err)
  });
const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log(`Server Is Running on Port ${port}`);
});
