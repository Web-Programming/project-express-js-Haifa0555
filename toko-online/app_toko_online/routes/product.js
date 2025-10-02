var express = require("express");
var router = express.Router();
var products = require("../data/products.json");

router.get("/:id", function (req, res, next) {
  const productId = parseInt(req.params.id); //ambil tangkap id dari parameter URL
  const product = products.find((p) => p.id === productId); //cari produk berdasarkan id

  if (!product) {
    //jika produk tidak ditemukan
    return res.status(404).send("Product tidak ditemukan");
  }

  res.render("product-detail", {
    title: product.name,
    product: product,
  });
});

// tambahan soal 3
router.get("/:productId/review/:reviewId", function (req, res, next) {
  const productId = parseInt(req.params.productId);
  const reviewId = parseInt(req.params.reviewId);

  const product = products.find((p) => p.id === productId);
  if (!product) {
    return res.status(404).send("Produk Tidak Ditemukan");
  }

  const review = {
    id: reviewId,
    content: `Ini adalah review ${reviewId} untuk produk ${productId}`,
  };

  res.render("review-detail", {
    title: `Ulasan ${reviewId} untuk Produk ${productId}`,
    productId,
    reviewId,
    product,
    review,
  });
});

module.exports = router;
