const express = require("express");
require("express-async-errors");
require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const logger = require("./utils/logger");
const cors = require("cors");

const postsRouter = require("./routes/postsRouter");
const userRouter = require("./routes/userRouter");
const errorMiddleware = require("./middlewares/errorMiddleware");

const app = express();

app.use(morgan("dev"));
app.use(express.json());

app.use(cors());

app.use("/users", userRouter);
app.use("/posts", postsRouter);

// Error handling middleware
app.use(errorMiddleware);

mongoose.connect(process.env.DATABASE_URI).then(() => {
  logger.info("Connected to MongoDB Server");
  app.listen(process.env.PORT, () => {
    logger.info(`Server is running on port ${process.env.PORT}`);
  });
});
