const fs = require("fs");
const Food = require("../models/foodModel");

const addFood = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;
    const image = req.file.filename; // Multer stores uploaded file details in req.file

    // Create new Food instance
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
      message: "Food added successfully",
    });
  } catch (error) {
    console.error("Error adding food:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error " + error,
    });
  }
};

//All food list
const listFood = async (req, res) => {
  try {
    const foods = await Food.find({});
    res.json({
      success: true,
      message: "All food found",
      data: foods,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "All food not found:  " + error,
    });
  }
};

//Remove food items
const removeFood = async (req, res) => {
  try {
    const { id } = req.params;
    const food = await Food.findById(id);
    if (!food) {
      return res.status(500).json({
        message: "food item not found",
      });
    }
    fs.unlink(`uploads/${food.image}`, () => {});

    //Delete food item otherwise
    const deleteFood = await Food.findByIdAndDelete(id);
    res.status(200).json({
      success: true,
      message: "food item deleted successful",
      data: deleteFood,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "food item not deleted: " + error,
    });
  }
};
module.exports = { addFood, listFood, removeFood };
