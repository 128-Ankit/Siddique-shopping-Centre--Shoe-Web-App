const user = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const validator = require("validator");
require("dotenv").config();

//Generate Token
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET);
};

//Register user
const registerUser = async (req, res) => {
  try {
    //fetch data from req body
    const { name, email, password } = req.body;
    //validation: is user exist or not
    const userExist = await user.findOne({ email });
    if (userExist) {
      return res.json({
        success: false,
        message: "User already exist",
      });
    }

    //validation email format and strong password
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Please enter a valid email",
      });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please enter strong password",
      });
    }

    // hashing user password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = user({
      name: name,
      email: email,
      password: hashedPassword,
    });

    //save newUser in DB
    const User = await newUser.save();
    const token = createToken(User._id);
    res.json({
        success:true,
        message:"User registered successfully",
        token,
    })
  } catch (error) {
    res.json({
        success:false,
        message:"User registration failed" + error,
    })
  }
};

//Login user
const loginUser = async (req, res) => {
    try {
        //get data from req.body
        const {email,password} = req.body;
        //validation: is user registered or not
        const User = await user.findOne({email});
        if(!User){
            res.json({
                success:false,
                message:"User not registered",
            })
        }
        //matched password store in db
        const isMatch = await bcrypt.compare(password,User.password);
        if(!isMatch){
            return res.json({
                success:false,
                message:"Password or Email not match",
            })
        }

        const token = createToken(User._id);
        res.json({
            success:true,
            messages:"Login successful",
            token,
        })
    } catch (error) {
        res.json({
            success:false,
            messages:"Login failed try again " + error,
        })
    }
};

module.exports = { loginUser, registerUser };
