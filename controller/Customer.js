const customerSchema = require("../Models/customer_schema");
const bcrypt = require("bcryptjs");
const jsonwebtoken = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const env = require("dotenv");
env.config();

const SECRETE_KEY = process.env.TOKEN_SECRET; // Use a secure and environment-specific secret key

// Register a new customer
const Register = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    const checkEmail = await customerSchema.findOne({ email });
    if (checkEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newCustomer = new customerSchema({
      name,
      phone,
      email,
      password: hashedPassword,
    });

    const savedCustomer = await newCustomer.save();
    console.log("New customer registered successfully");
    res.status(201).json({
      success: true,
      message: "New customer registered successfully",
      customer: savedCustomer,
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err, message: "Internal Server Error" });
  }
};

// Customer login
const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await customerSchema.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Email or Password Invalid!" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) {
      return res.status(400).json({ message: "Email or Password Invalid!" });
    }

    const token = jsonwebtoken.sign({ userId: user.id }, SECRETE_KEY, {
      expiresIn: "1h",
    });
    console.log("Login successful!");
    res.json({
      message: "Login successful!",
      success: true,
      loggedInUser: user,
      authToken: token,
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res.status(500).json({ error: err, message: "Internal Server Error" });
  }
};

// Send OTP for email verification
const Otp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const generateOtp = Math.floor(1000 + Math.random() * 9000); // 4-digit OTP

    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.MAILTRAP_USER, // Use environment variables for sensitive info
        pass: process.env.MAILTRAP_PASS,
      },
    });

    const info = await transporter.sendMail({
      from: "gauthamkotian020@gmail.com", // sender address
      to: email, // list of receivers
      subject: "New OTP Generated", // Subject line
      html: `<b>OTP is: <i>${generateOtp}</i></b>`, // HTML body
    });

    if (info.messageId) {
      const user = await customerSchema.findOneAndUpdate(
        { email },
        { otp: generateOtp },
        { new: true }
      );

      if (!user) {
        return res.status(400).json({ message: "User does not exist" });
      }

      return res
        .status(200)
        .json({ message: "OTP Sent Successfully", success: true });
    }

    return res.status(500).json({ message: "Failed to send OTP" });
  } catch (err) {
    console.log("Error occurred:", err);
    res.status(500).json({ error: err.message });
  }
};

// Verify OTP for user authentication
const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required!" });
    }

    const user = await customerSchema.findOne({ email, otp });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP!" });
    }

    user.otp = 0; // Clear OTP after successful verification
    await user.save();

    const token = jsonwebtoken.sign({ userId: user.id }, SECRETE_KEY, {
      expiresIn: "1h",
    });

    res.json({
      message: "OTP verification successful and login complete!",
      success: true,
      loggedInUser: user,
      authToken: token,
    });
  } catch (err) {
    console.error("Error occurred:", err);
    res
      .status(500)
      .json({ error: err.message, message: "Internal Server Error" });
  }
};

// Get all customers
const customer = async (req, res) => {
  try {
    const customers = await customerSchema.find();
    console.log(customers);
    res.json(customers);
  } catch (err) {
    console.log("Error occurred:", err);
    res.json({ error: err.message });
  }
};

module.exports = {
  Register,
  Login,
  Otp,
  verifyOtp,
  customer,
};
