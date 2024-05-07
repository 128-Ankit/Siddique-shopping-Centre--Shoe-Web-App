const user = require("../models/userModel");

//add items to user cart
const addToCart = async (req, res) => {
  try {
    let userData = await user.findById(req.body.userId);
    console.log("User data: " + userData);
    let cartData = userData.cartData;
    if (!cartData[req.body.id]) {
      cartData[req.body.id] = 1;
    } else {
      cartData[req.body.id] += 1;
      console.log("cartId: " + req.body.id);
    }
    await user.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({
      success: true,
      message: "Added to Cart",
      cartData
    });
  } catch (error) {
    res.json({
      success: false,
      message: "Error to adding cart: " + error,
    });
  }
};

//remove item from user cart
const removeFromCart = async (req, res) => {
    try {
    let userData = await user.findById(req.body.userId);
      
      if (!userData) {
          return res.status(404).json({
              success: false,
              message: "User not found",
            });
        }
        
      console.log("userData: ", userData);
      let cartData = userData.cartData;
      console.log("Cart data: " + cartData);
  
      if (cartData[req.body.id] > 0) {
        cartData[req.body.id] -= 1;
      }
      
      await user.findOneAndUpdate({ _id: req.body.userId }, { cartData });
      res.json({
        success: true,
        message: "Removed from cart",
        cartData
      });

    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        message: "Item not removed from cart " + error,
      });
    }
  };
  
//fetch user cart data
const getCart = async (req, res) => {
    try {
        let userData = await user.findById(req.body.userId);
        console.log("userData: "+ userData);
        let cartData = await userData.cartData;
        res.json({
            success:true,
            message:"all data fetched",
            cartData
        })
    } catch (error) {
        res.json({
            success: false,
            message: "Error to fetching cart data: " + error,
          });
    }
};

module.exports = { addToCart, removeFromCart, getCart };
