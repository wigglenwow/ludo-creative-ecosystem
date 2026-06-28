const Product = require('../models/Product');

// =========================================================================
// CREATE PRODUCT (Seller Protected)
// =========================================================================
exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, mediaType, stock } = req.body;

    // Build the item payload linked explicitly to the logged-in user's ID
    const newProduct = await Product.create({
      seller: req.user.id, 
      title,
      description,
      price,
      mediaType,
      stock
    });

    res.status(201).json({
      message: "Product listed successfully inside your storefront!",
      product: newProduct
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating product listing.", error: error.message });
  }
};

// =========================================================================
// GET ALL PRODUCTS (Public Catalog View)
// =========================================================================
exports.getAllProducts = async (req, res) => {
  try {
    // Fetch everything and automatically swap seller IDs for their actual Brand Names
    const products = await Product.find()
      .populate('seller', 'sellerDetails.brandName name')
      .sort({ createdAt: -1 }); // Newest items first

    res.status(200).json({
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching catalog.", error: error.message });
  }
};

// =========================================================================
// ADVANCED SEARCH & FILTER ENGINE
// =========================================================================
exports.searchProducts = async (req, res) => {
  try {
    const { keyword, mediaType, maxPrice } = req.query;
    let queryConfig = {};

    // 1. Text Keyword matching across Title using case-insensitive regex
    if (keyword) {
      queryConfig.title = { $regex: keyword, $options: 'i' };
    }

    // 2. Strict category filtering by medium
    if (mediaType) {
      queryConfig.mediaType = mediaType;
    }

    // 3. Financial Range Filtering (Less Than or Equal To)
    if (maxPrice) {
      queryConfig.price = { $lte: Number(maxPrice) };
    }

    const filteredCatalog = await Product.find(queryConfig)
      .populate('seller', 'sellerDetails.brandName name');

    res.status(200).json({
      count: filteredCatalog.length,
      products: filteredCatalog
    });
  } catch (error) {
    res.status(500).json({ message: "Error executing advanced query search.", error: error.message });
  }
};
// =========================================================================
// GET SINGLE PRODUCT BY ID (Detailed Profile View)
// =========================================================================
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('seller', 'sellerDetails.brandName name');

    if (!product) {
      return res.status(404).json({ message: "Masterpiece listing not found." });
    }

    // Wrap the product inside a clean payload block object
    res.status(200).json({
      success: true,
      product
    });
  } catch (error) {
    res.status(500).json({ message: "Error parsing product lookup parameters.", error: error.message });
  }
};