const Order = require('../models/Order');
const mongoose = require('mongoose');

exports.getSellerDashboard = async (req, res) => {
  try {
    const sellerId = new mongoose.Types.ObjectId(req.user.id);

    // Run a high-performance database aggregation query
    const analytics = await Order.aggregate([
      { $match: { seller: sellerId } },
      { 
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalItemsSold: { $sum: "$quantity" },
          orderCount: { $count: {} }
        }
      }
    ]);

    // Format output if seller has no sales data yet
    const data = analytics[0] || { totalRevenue: 0, totalItemsSold: 0, orderCount: 0 };

    res.status(200).json({
      message: "Analytics performance metrics retrieved.",
      metrics: {
        totalRevenue: data.totalRevenue,
        totalItemsSold: data.totalItemsSold,
        totalOrdersPlaced: data.orderCount
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error compiling dashboard metrics.", error: error.message });
  }
};