const express = require('express');
const router = express.Router();

// 🛠️ Destructure the exact function hooks straight out of your controller module
const { 
  getAllProducts, 
  searchProducts, 
  getProductById, 
  createProduct 
} = require('../controllers/productController');

const { protect } = require('../middleware/authMiddleware'); 

// =========================================================================
// PRODUCT MODULE ROUTING ROUTE LAYOUT
// =========================================================================

// 1. Public catalog grid endpoint (GET /api/products)
router.get('/', getAllProducts);

// 2. Advanced search processing (GET /api/products/search)
router.get('/search', searchProducts);

// 3. 🔍 Single item database fetch parameter hook (GET /api/products/:id)
router.get('/:id', getProductById);

// 4. Protected storefront creator upload deployment (POST /api/products)
router.post('/', protect, createProduct);

module.exports = router;