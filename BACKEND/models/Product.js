const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  // Link to the specific Artist who created the listing
  seller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: { 
    type: String, 
    required: [true, 'A product title is required.'],
    trim: true 
  },
  description: { 
    type: String, 
    required: [true, 'A product description is required.'] 
  },
  price: { 
    type: Number, 
    required: [true, 'A product price is required.'],
    min: [0, 'Price cannot be negative.']
  },
  // To filter by medium (e.g., "Watercolor", "Acrylic", "Epoxy Resin", "Charcoal")
  mediaType: { 
    type: String, 
    required: true 
  },
  images: [{ 
    type: String, 
    default: ['default-product.png'] // Placeholders until we build file uploads
  }],
  stock: { 
    type: Number, 
    default: 1, // Useful for 1-of-1 original fine art pieces
    min: 0
  },
  // The Effort Validation tracking phase blueprint array
  productionSteps: [{
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true }
  }]
}, {
  timestamps: true
});

// Index common search routes for speed optimizations
productSchema.index({ mediaType: 1, price: 1 });

module.exports = mongoose.model('Product', productSchema);