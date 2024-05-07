const express= require('express');
const cors  = require('cors') 
require('dotenv').config();
const connectDB = require('./config/db');
const foodRouter = require('./routes/foodRoute');
const userRouter = require('./routes/userRoute');
const cartRouter = require('./routes/cartRoute');
const orderRouter = require('./routes/orderRoute');

//app config
const app = express()
const port = 4000

//middleware
app.use(express.json())
app.use(cors()); //access backend from frontend

//db connection
connectDB(); 

//api endpoints
app.use("/api/food", foodRouter)
app.use("/images",express.static('uploads'));
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
 

app.listen(port,()=>{
    console.log(`App is running on port:${port}`);
})