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
router.get("/search", function (req, res, next) {
  const query = req.query.q ? req.query.q.toLowerCase() : "";

  const products = [
    "Laptop Gaming",
    "Smartphone Flagship",
    "Headset Wireless",
    "Smartwatch",
    "Keyboard Mechanical",
  ];

  const results = query
    ? products.filter((product) => product.toLowerCase().includes(query))
    : products;

  res.render("search-result", { query: req.query.q, results });
});

const results = products.filter((p) => p.toLowerCase().includes(query));

res.render("search-result", { query: req.query.q, results });
module.exports = router;
