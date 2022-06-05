const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const multer = require("multer");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 5000;
dotenv.config();
const DB_URI = process.env.DB_URI;
const dbConnection = async () => {
  try {
    const conn = await mongoose.connect(DB_URI);
    if (conn) {
      console.log("CONNECTED TO DB SUCCESSFULL");
    }
  } catch (error) {
    console.log("FAILED TO CONNECT", error);
  }
};
dbConnection();
app.use(express.json());
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});
const upload = multer({ storage });

app.use(express.static("build"));
app.post("/api/upload", upload.single("file"), (req, res) => {
  res.status(200).json(req.body);
});
app.use("/public", express.static("images"));
app.use("/api/auth/", require("./routes/auth"));
app.use("/api/cat/", require("./routes/catagory"));
app.use("/api/profile/", require("./routes/profile"));
app.use("/api/comment/", require("./routes/comment"));
app.use("/api/post/", require("./routes/posts"));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build/index.html"));
});
app.listen(port, () => {
  console.log(`Backend is listening at ${port}...`);
});
