var express = require("express");
var router = express.Router();
products = require("../data/products.json");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", {
    title: "Toko online Sederhana",
    products: products,
  });
});

module.exports = router;
