const express = require("express");
const { addFood, listFood, removeFood } = require("../controllers/foodController");
const multer = require("multer");

const foodRouter = express.Router();

// Multer storage configuration
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});

const upload = multer({ storage: storage });

// Route for adding food with file upload
foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.delete("/remove/:id", removeFood);

module.exports = foodRouter;
