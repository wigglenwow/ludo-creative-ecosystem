const Order = require('../models/Order');
const Product = require('../models/Product');

// =========================================================================
// PLACE A NEW ORDER (Deducts Stock Automatically)
// =========================================================================
exports.createOrder = async (req, res) => {
  try {
    const { productId, quantity, shippingAddress } = req.body;
    const buyerId = req.user.id;

    if (!productId || !shippingAddress) {
      return res.status(400).json({ message: "Product ID and shipping address are required." });
    }

    // 1. Fetch target product and verify existence
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // 2. Inventory Constraint Check
    const orderQuantity = quantity || 1;
    if (product.stock < orderQuantity) {
      return res.status(400).json({ 
        message: `Insufficient inventory. Only ${product.stock} left in stock.` 
      });
    }

    // 3. Mathematical computation of financial total
    const totalAmount = product.price * orderQuantity;

    // 4. Create the Order document
    const order = await Order.create({
      buyer: buyerId,
      seller: product.seller, // Link straight to the artist who created the product listing
      product: productId,
      quantity: orderQuantity,
      totalAmount,
      shippingAddress
    });

    // 5. ACID Adjustment: Atomically decrement product stock count
    product.stock -= orderQuantity;
    await product.save();

    res.status(201).json({
      message: "Order placed successfully! Stock updated.",
      order
    });

  } catch (error) {
    res.status(500).json({ message: "Server error processing checkout.", error: error.message });
  }
};

// =========================================================================
// GET USER ORDERS (Fetches history relevant only to the active user)
// =========================================================================
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    // Pull documents where the user is EITHER the buyer OR the selling artist
    const orders = await Order.find({
      $or: [{ buyer: userId }, { seller: userId }]
    })
    .populate('product', 'title price mediaType')
    .populate('buyer', 'name email')
    .populate('seller', 'sellerDetails.brandName name')
    .sort({ createdAt: -1 });

    res.status(200).json({
      count: orders.length,
      orders
    });
  } catch (error) {
    res.status(500).json({ message: "Server error retrieving orders.", error: error.message });
  }
};