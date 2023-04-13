const express = require("express");
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 4000;
const DB = require("./config/db");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
var cors = require("cors");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const userRouter = require("./routes/userRoute");
const postRouter = require("./routes/postRoute");
const commentRouter = require("./routes/commentRoute");

DB();
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api/user", userRouter);
app.use("/api/post", postRouter);
app.use("/api/comment", commentRouter);

app.use(notFound);
app.use(errorHandler);
app.listen(PORT, console.log("Server started on PORT" + " " + PORT));
