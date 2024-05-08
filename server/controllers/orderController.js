const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");
const Stripe = require("stripe");
require("dotenv").config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const frontend_url = "http://localhost:5173";

// Function to place an order for a user
const placeOrder = async (req, res) => {
  console.log("placeOrder " + req.body);
  try {
    // Create a new order document
    const newOrder = new orderModel({
      userId: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    // Save the new order document to the database
    await newOrder.save();

    // Clear the user's cartData after placing the order
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    // Construct line items for Stripe payment
    const lineItems = req.body.items.map((item) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: item.name,
        },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    // Add delivery charges as a line item
    lineItems.push({
      price_data: {
        currency: "inr",
        product_data: {
          name: "Delivery Charges",
        },
        unit_amount: 2 * 100,
      },
      quantity: 1,
    });

    // Create a checkout session with Stripe
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_url}/verify?success=false&orderId=${newOrder._id}`,
    });

    // Send the session URL back to the client
    res.json({
      success: true,
      session_url: session.url,
    });
  } catch (error) {
    console.log("Error is: " + error);
    res.json({
      success: false,
      message: "Error: " + error.message,
    });
  }
};

// Function to verify an order for a user
const verifyOrder = async (req, res) => {
  try {
    const { orderId, success } = req.body;
    if (success == "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({
        success: true,
        message: "Payment Successful!",
      });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({
        success: false,
        message: "Not paid",
      });
    }
  } catch (error) {
    console.log("payment error: " + error);
    res.json({
      success: false,
      message: "Error",
    });
  }
};

// Users order for frontend
const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.body.userId });
    console.log(orders);
    res.json({
      success: true,
      orders: orders,
      message: "User Order Successful",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "error",
    });
  }
};

//find all orders of all user - Admin
const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({});
    res.json({
      success: true,
      data: orders,
      message: "Get all orders",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error Get all orders " + error,
    });
  }
};

//updating order status - Admin
const updateStatus = async (req, res) => {
  try {
    await orderModel.findByIdAndUpdate(req.body.orderId, {
      status: req.body.status,
    });
    res.json({
      success: true,
      message: "Status Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error while Status Updating: " + error,
    });
  }
};

// Remove order from admin panel
const deleteOrder = async (req, res) => {
  try {
    const {id} = req.params;
    const deleteItem = await orderModel.findById(id);
    console.log("deleteItem: "+ deleteItem);
    if (!deleteItem) return res.send("no such item found");
    const DeleteItem = await orderModel.findByIdAndDelete(id);
    res.json({
      success: true,
      message: "Item Deleted successful",
      data: DeleteItem,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error while deleting item: " + error,
    });
  }
};

module.exports = {
  placeOrder,
  verifyOrder,
  userOrders,
  listOrders,
  updateStatus,
  deleteOrder,
};
