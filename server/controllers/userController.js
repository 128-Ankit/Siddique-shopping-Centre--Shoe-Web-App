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
      success: true,
      message: "User registered successfully",
      token,
    });
  } catch (error) {
    res.json({
      success: false,
      message: "User registration failed" + error,
    });
  }
};

//Login user
// const loginUser = async (req, res) => {
//   try {
//     //get data from req.body
//     const { email, password } = req.body;
//     //validation: is user registered or not
//     const User = await user.findOne({ email });
//     if (!User) {
//       res.json({
//         success: false,
//         message: "User not registered",
//       });
//     }

//     //matched password store in db
//     const isMatch = await bcrypt.compare(password, User.password);
//     if (isMatch) {
//       return res.json({
//         success: true,
//         messages: "Login successful",
//         // message:"Password or Email not match",
//       });
//     }
//     else{
//       return res.status(401).json({
//         success: false,
//         msg: "Invalid Password!"
//     });
//     }

//     const token = createToken(User._id);
//     res.json({
//       success: true,
//       messages: "Login successful",
//       token,
//     });
//   } catch (error) {
//     res.json({
//       success: false,
//       messages: "Login failed try again " + error,
//     });
//   }
// };
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(email, password);

    const userExist = await user.findOne({ email });
    console.log("userExist: ", userExist);
    if (!userExist) {
      return res.json({ 
        message: "Email does not exist" 
      });
    }
    //checking the password using bcrypt compare method
    const validPassword = await bcrypt.compare(password, userExist.password);
    if (validPassword) {
      res.status(200).json({
        success: true,
        message: "Login Successfully",
        userId: userExist._id.toString(),
        token: await createToken(userExist._id),
      });
    } else {
      return res.json({
        success: false,
        message: "Invalid Password or Email",
      });
    }
  } catch (error) {
    res.json({
      success: false,
      messages: "Login failed try again " + error,
    });
  }
};

module.exports = { loginUser, registerUser };
