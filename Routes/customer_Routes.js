const express = require("express");
const router = express.Router();
const {
  Register,
  Login,
  Otp,
  verifyOtp,
  customer,
} = require("../controller/Customer");

router.post("/register", Register);
router.post("/login", Login);
router.post("/otp", Otp);
router.post("/verifyotp", verifyOtp);
router.get("/viewcustomer", customer);

// Example of a protected route

module.exports = router;
