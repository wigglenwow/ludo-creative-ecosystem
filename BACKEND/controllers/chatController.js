const Chat = require('../models/Chat');
const Message = require('../models/Message');

// Ensure a chat room exists between a buyer and seller for a specific product
exports.accessChat = async (req, res) => {
  try {
    const { sellerId, productId } = req.body;
    const buyerId = req.user.id; // From auth protection middleware

    if (buyerId === sellerId) {
      return res.status(400).json({ message: "You cannot start a negotiation stream with yourself." });
    }

    // Check if conversation already exists
    let existingChat = await Chat.findOne({
      buyer: buyerId,
      seller: sellerId,
      product: productId
    }).populate('seller', 'name sellerDetails.brandName')
      .populate('buyer', 'name')
      .populate('product', 'title price images');

    if (existingChat) {
      return res.status(200).json({ success: true, chat: existingChat });
    }

    // Otherwise, construct a brand new chat channel
    const newChat = await Chat.create({
      buyer: buyerId,
      seller: sellerId,
      product: productId
    });

    const fullChat = await Chat.findById(newChat._id)
      .populate('seller', 'name sellerDetails.brandName')
      .populate('buyer', 'name')
      .populate('product', 'title price images');

    res.status(201).json({ success: true, chat: fullChat });
  } catch (error) {
    res.status(500).json({ message: "Error initializing communication channel.", error: error.message });
  }
};

// Fetch all messages belonging to a single conversation room
exports.getChatMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 }); // Oldest messages first for chat timeline flow

    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: "Error pulling historic communication telemetry.", error: error.message });
  }
};

// Retrieve all active chat panels for the logged-in user dashboard list
exports.getUserChats = async (req, res) => {
  try {
    const userId = req.user.id;
    const chats = await Chat.find({
      $or: [{ buyer: userId }, { seller: userId }]
    }).populate('seller', 'name sellerDetails.brandName')
      .populate('buyer', 'name')
      .populate('product', 'title price images')
      .sort({ updatedAt: -1 }); // Most recently active chats up top

    res.status(200).json({ success: true, chats });
  } catch (error) {
    res.status(500).json({ message: "Error gathering structural chat matrices.", error: error.message });
  }
};
// =========================================================================
// POST A NEW MESSAGE TO A CHAT ROOM
// =========================================================================
exports.createMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const chatId = req.params.chatId;

    if (!text) {
      return res.status(400).json({ message: "Cannot send an empty message packet." });
    }

    // Create the message document entry linked explicitly to the logged-in user
    const newMessage = await Message.create({
      chat: chatId,
      sender: req.user.id,
      text
    });

    // Update the parent chat room's lastMessage telemetry tracker field
    await Chat.findByIdAndUpdate(chatId, { lastMessage: text });

    res.status(201).json({
      success: true,
      message: newMessage
    });
  } catch (error) {
    res.status(500).json({ message: "Error committing message payload to database.", error: error.message });
  }
};