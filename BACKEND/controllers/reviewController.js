const Review = require('../models/Review');
const Order = require('../models/Order');

exports.leaveReview = async (req, res) => {
  try {
    const { productId, rating, comment } = req.body;
    const buyerId = req.user.id;

    // Gatekeeper: Check if an order exists for this buyer and product
    const verifiedPurchase = await Order.findOne({
      buyer: buyerId,
      product: productId
    });

    if (!verifiedPurchase) {
      return res.status(403).json({ 
        message: "Review denied. You can only review products you have legitimately purchased." 
      });
    }

    const review = await Review.create({
      product: productId,
      buyer: buyerId,
      rating,
      comment
    });

    res.status(201).json({ message: "Review posted successfully!", review });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already reviewed this product." });
    }
    res.status(500).json({ message: "Server error posting review.", error: error.message });
  }
};