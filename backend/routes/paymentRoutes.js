const express = require("express");
const {
  handlePaymentInitiation,
  handlePaymentValidation,
  getAllPayments,
  getPaymentById,
  getMyEventPayments,
} = require("../controllers/paymentController");
const {
  authenticateUser,
  authorizeRoles,
} = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/validate/:merchantTransactionId", handlePaymentValidation);
router.get("/pay", authenticateUser, handlePaymentInitiation);
router.get(
  "/transactions/",
  authenticateUser,
  authorizeRoles("admin"),
  getAllPayments
);
router.get("/transactions/my-events", authenticateUser,getMyEventPayments);
router.get("/transactions/:id",authenticateUser, getPaymentById);

module.exports = router;
