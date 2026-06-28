const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // ==========================================
  // 1. BASE PROPERTIES (EVERYONE / THE BUYER)
  // ==========================================
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, 
  passwordHash: { type: String, required: true }, // The scrambled password
  profilePicture: { type: String, default: 'default-avatar.png' },
  
  // Role-Based Access Control Tag
  role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },
  
  buyerBadges: [{ type: String }], // e.g., ["New Player", "Art Collector"]
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }], 

  // ==========================================
  // 2. SELLER PROPERTIES (THE ARTIST EXTENSION)
  // ==========================================
  sellerDetails: {
    brandName: { type: String }, // e.g., "WiggleNWow"
    isVerified: { type: Boolean, default: false },
    trustScore: { type: Number, default: 0 }, 
    portfolioVideos: [{ type: String }], 
    totalSales: { type: Number, default: 0 }
  }
}, { 
  timestamps: true // Automatically logs 'createdAt' and 'updatedAt'
});

module.exports = mongoose.model('User', userSchema);