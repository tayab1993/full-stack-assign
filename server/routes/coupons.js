const express = require("express");
const CouponsController = require("../controllers/coupons");
const verifyUser = require("../middlewares/authenticateUser");

const router = express.Router();

router.post("/createCoupon", verifyUser, CouponsController.createCoupon);
router.get("/getAllCoupons", verifyUser, CouponsController.getAll);
router.post("/deleteCoupon", verifyUser, CouponsController.deleteCoupon);

module.exports = router;