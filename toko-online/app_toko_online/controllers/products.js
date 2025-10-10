var express = require("express");
var router = express.Router();
var ProductController = require("../controllers/product");

router.get("/all",ProductController.index);
router.get("/:id", ProductController.detail);

module.exports = router;