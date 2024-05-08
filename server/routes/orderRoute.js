const express = require("express");
const {placeOrder,verifyOrder, userOrders, listOrders, updateStatus, deleteOrder} = require("../controllers/orderController");
const authMiddleware = require("../middleware/auth");
const orderRouter = express.Router();

orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/verify", verifyOrder);
orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.get("/list", listOrders);
orderRouter.post("/status", updateStatus);
orderRouter.delete("/deleteorder/:id", deleteOrder);

module.exports = orderRouter;
