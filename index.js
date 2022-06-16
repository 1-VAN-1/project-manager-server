require("dotenv").config();
const express = require("express");
const { default: mongoose } = require("mongoose");
const routers = require("./router");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const errorMiddleware = require("./middleware/error-middleware");
const path = require("path");
const history = require("connect-history-api-fallback");

const PORT = process.env.PORT || 5000;
const DB_URL = process.env.DB_URL || "";

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

routers.forEach((router) => {
  app.use("/api", router);
});

app.use(express.static(path.resolve(__dirname, "static")));

app.get("/static/uploads/:filename", (req, res) => {
  res.sendFile(
    path.resolve(__dirname, "static", "uploads", req.params.filename)
  );
});

app.use(
  history({
    index: path.resolve(__dirname, "static", "index.html"),
  })
);

app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "static", "index.html"));
});

app.use(errorMiddleware);

const start = async () => {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
