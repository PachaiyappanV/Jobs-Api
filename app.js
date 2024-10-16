require("dotenv").config();
require("express-async-errors");
const path = require("path");

//security packeges
const helmet = require("helmet");
const xss = require("xss-clean");

const express = require("express");
const app = express();

app.set("trust proxy", 1);

app.use(express.json());
app.use(helmet());
app.use(xss());
//db connection
const connectDb = require("./db/connect");

//middlewares
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");
const authenticate = require("./middleware/authentication");

//routes
const authRoute = require("./routes/auth");
const jobsRoute = require("./routes/jobs");

//path
app.use(express.static(path.resolve(__dirname, "./client/build")));

//using routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authenticate, jobsRoute);

//starting our homepage
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./client/build", "index.html"));
});

//using middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    console.log("Database connected sucessfully");
    app.listen(port, () =>
      console.log(`Server is up and running on port ${port}`)
    );
  } catch (error) {
    console.log(error);
  }
};
start();
