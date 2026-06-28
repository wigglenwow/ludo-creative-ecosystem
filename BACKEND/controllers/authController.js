const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// =========================================================================
// REGISTER / SIGNUP CONTROLLER
// =========================================================================
exports.signup = async (req, res) => {
  try {
    // 1. Extract clean validation parameters from incoming body payload
    const { name, email, password, role } = req.body;

    // 2. Validation Check: Stop execution if crucial keys are missing
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields (name, email, password) are required." });
    }

    // 3. Collision Check: Ensure user doesn't already exist in MongoDB Atlas
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "An account with this email already exists." });
    }

    // 4. Cryptographic Hashing: Scramble the raw text password safely
    const salt = await bcrypt.genSalt(10); 
    const passwordHash = await bcrypt.hash(password, salt);

    // 5. Execution: Create and save the new user record into your cluster
    const newUser = await User.create({
      name,
      email,
      passwordHash,
      role: role || 'buyer' // Assign incoming role selection or fallback safely to buyer
    });

    // 6. Response: Return success code 201 along with the unique record ID
    res.status(201).json({
      message: "User registered successfully!",
      userId: newUser._id
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Server error during registration.", 
      error: error.message 
    });
  }
};

// =========================================================================
// LOGIN CONTROLLER 
// =========================================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation Check
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    // 2. Lookup: Find user using your unique email schema constraint index
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 3. Mathematical Verification: Compare incoming text with stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // 4. Token Provisioning: Generate the stateless authorization tag (JWT)
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || 'fallback_secret_key_for_now',
      { expiresIn: '30d' }
    );

    // 5. Response: Pass the validation data right back down to your AuthContext
    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ 
      message: "Server error during login.", 
      error: error.message 
    });
  }
};

// =========================================================================
// BECOME A SELLER / UPGRADE ACCOUNT CONTROLLER
// =========================================================================
exports.upgradeToSeller = async (req, res) => {
  try {
    const { brandName } = req.body;

    if (!brandName) {
      return res.status(400).json({ message: "Brand name is required to register as a seller." });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Update role parameters safely
    user.role = 'seller';
    user.sellerDetails.brandName = brandName;
    user.sellerDetails.isVerified = true; 

    await user.save();

    res.status(200).json({
      message: "Account successfully upgraded to Seller status!",
      user: {
        id: user._id,
        name: user.name,
        role: user.role,
        brandName: user.sellerDetails.brandName
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Server error during account upgrade.", error: error.message });
  }
};