const express = require("express");
const { getCoopeProducts } = require("../controllers/coopeController");

const router = express.Router();

router.get("/coope/products", getCoopeProducts);

module.exports = router;
