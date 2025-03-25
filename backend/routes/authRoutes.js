const express = require("express");
const {
  signup,
  login,
  updateDeviceToken,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const { authenticateUser } = require("../middlewares/authMiddleware");
const passport = require("passport");
const generateToken = require("../utils/generateToken");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/update-device-token", authenticateUser, updateDeviceToken);

// reset password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

// Google OAuth routes
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: false,
  }),
  (req, res) => {
    const token = generateToken(req.user._id, req.user.role);
    res.redirect(
      `${
        process.env.FRONTEND_GOOGLE_REDIRECT_URL
      }?token=${token}&user=${encodeURIComponent(
        JSON.stringify({
          id: req.user._id,
          name: req.user.name,
          image: req.user.image,
          email: req.user.email,
          role: req.user.role,
        })
      )}`
    );
  }
);

module.exports = router;
