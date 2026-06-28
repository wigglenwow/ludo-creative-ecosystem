const Wishlist = require('../models/Wishlist');

exports.toggleWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.user.id;

    // Find or create the user's personal wishlist capsule document
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: userId, products: [] });
    }

    const itemIndex = wishlist.products.indexOf(productId);

    if (itemIndex > -1) {
      // Product exists -> Extract it (Remove from wishlist)
      wishlist.products.splice(itemIndex, 1);
      await wishlist.save();
      return res.status(200).json({ message: "Product removed from your wishlist.", wishlist });
    } else {
      // Product missing -> Append it (Add to wishlist)
      wishlist.products.push(productId);
      await wishlist.save();
      return res.status(200).json({ message: "Product saved to your wishlist!", wishlist });
    }
  } catch (error) {
    res.status(500).json({ message: "Error modifying wishlist catalog.", error: error.message });
  }
};