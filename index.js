require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const { userRouter } = require("./route/user");
const { coursesRouter } = require("./route/courses");
const { adminRouter } = require("./route/admin");

const app = express();

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/courses", coursesRouter);

// the below code makes sure that the db is connected successfully first and then the backend server is working.
async function main() {
  await mongoose.connect(process.env.MONGODB_URL);
  app.listen(3000);
}

main();
