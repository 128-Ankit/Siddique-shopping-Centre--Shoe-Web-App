const fs = require("fs");
const Food = require("../models/foodModel");

const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file.filename; // Multer stores uploaded file details in req.file

    // Create new Product instance
    const newFood = new Food({
      name,
      description,
      price,
      category,
      image,
    });

    // Save to database
    await newFood.save();

    res.status(201).json({
      success: true,
      message: "Product added successfully",
    });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error " + error,
    });
  }
};

//Remove items
const removeFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) {
      return res.status(500).json({
        message: "Product not found",
      });
    }
    fs.unlink(`uploads/${food.image}`, () => {});

    //Delete item otherwise
    const deleteFood = await Food.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "Item deleted successful",
      data: deleteFood,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Item not deleted: " + error,
    });
  }
};

//All food list
const listFood = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json({
      success: true,
      message: "All Items found",
      data: foods,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "All Items not found:  " + error,
    });
  }
};
module.exports = { addFood, listFood, removeFood };
