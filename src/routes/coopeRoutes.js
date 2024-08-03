const express = require("express");
const { getCoopeProducts, getCoopeWeeklyOffers } = require("../controllers/coopeController");

const router = express.Router();

router.get("/coope/products", getCoopeProducts);

router.get("/coope/weekly-offers", getCoopeWeeklyOffers);

module.exports = router;
