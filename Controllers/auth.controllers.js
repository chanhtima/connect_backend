// require('dotenv').config();
const userModle = require("../Models/auth.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    const exituser = await userModle.findOne({ email });
    // CheckUser
    if (exituser) {
      return res
        .status(400)
        .json({ success: true, message: "User Already Exists !!!" });
    }
    // Encrypt ตรวจสอบรหัส
    const hasePassword = await bcrypt.hash(password, 10);

    const nweUser = new userModle({ email, username, password: hasePassword });
    await nweUser.save();
    res.status(200).json({
      success: true,
      message: "User register  success",
      userData: nweUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error register");
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    // 1.CheckUser
    const user = await userModle.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }
    // 2.CheckPassword
    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) {
      return res
        .status(409)
        .json({ success: false, message: "password Invlid !!!" });
    }

    // 3.token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
      },
      process.env.JWT_SECRET_KEY, 
      { expiresIn: "7d" } 
    );
    
    // 4. Save

    res.status(200).json({
      success: true,
      message: "Login Successful",
      userData: user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error login");
  }
};
