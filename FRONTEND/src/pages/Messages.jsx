import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { io } from 'socket.io-client';
import { api, useAuth } from '../context/AuthContext';

// Connect to your WebSocket portal running securely on port 3000
const socket = io('http://localhost:3000', { withCredentials: true });

function Messages() {
  // 🛠️ THE FIX: Safe context fallback shielding to stop the TypeError completely!
  const auth = useAuth();
  const user = auth && auth.user ? auth.user : null;
  
  const location = useLocation();
  const messagesEndRef = useRef(null);

  // Core Functional State Management Assemblies
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessageText, setNewMessageText] = useState('');
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [localCrashError, setLocalCrashError] = useState('');

  // 1. Initial Mount: Gather all conversational streams for the logged-in user account
  useEffect(() => {
    const fetchUserChats = async () => {
      try {
        const response = await api.get('/chat');
        const retrievedChats = response.data?.chats || response.data || [];
        const safeChatsArray = Array.isArray(retrievedChats) ? retrievedChats : [];
        
        setChats(safeChatsArray);

        // Check if a navigation link passed an active room identifier to mount on entry
        const routedChatId = location.state?.activeChatId;
        if (routedChatId && safeChatsArray.length > 0) {
          const matchedChat = safeChatsArray.find(c => c?._id === routedChatId);
          if (matchedChat) handleSelectChat(matchedChat);
        }
      } catch (err) {
        console.error("Error synchronizing active conversations:", err);
        setLocalCrashError('Failed to fetch communications feed from API gateway.');
      } finally {
        setLoadingChats(false);
      }
    };

    fetchUserChats();
  }, [location.state]);

  // 2. Continuous Listener Lifecycle Hook: Processes real-time incoming broadcast packets
  useEffect(() => {
    if (!socket) return;

    socket.on('receive_message', (incomingMessage) => {
      if (!incomingMessage) return;
      
      // Append the message stream if it matches the actively open room context interface
      if (activeChat && incomingMessage.chat === activeChat._id) {
        setMessages((prev) => [...prev, incomingMessage]);
      }

      // Automatically update the side layout preview parameters safely
      setChats((prevChats) => {
        const safePrev = Array.isArray(prevChats) ? prevChats : [];
        return safePrev.map((c) =>
          c?._id === incomingMessage.chat
            ? { ...c, lastMessage: incomingMessage.text, updatedAt: new Date().toISOString() }
            : c
        ).sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
      });
    });

    return () => {
      socket.off('receive_message');
    };
  }, [activeChat]);

  // 3. Scroll Anchoring Lifecycle: Snaps viewport timeline directly to the latest bubble item
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle active channel selections and room registration changes
  const handleSelectChat = async (selectedChat) => {
    if (!selectedChat?._id) return;
    setActiveChat(selectedChat);
    setLoadingMessages(true);
    try {
      socket.emit('join_room', selectedChat._id);
      
      const response = await api.get(`/chat/${selectedChat._id}/messages`);
      const retrievedMessages = response.data?.messages || response.data || [];
      setMessages(Array.isArray(retrievedMessages) ? retrievedMessages : []);
    } catch (err) {
      console.error("Error reconstructing dialogue logs:", err);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Dispatch message text parameters across both the persistent database layer and active socket waves
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim() || !activeChat?._id) return;

    const currentUserId = user?._id || user?.id || '';
    const messagePayload = {
      chat: activeChat._id,
      sender: currentUserId,
      text: newMessageText.trim()
    };

    try {
      await api.post(`/chat/${activeChat._id}/messages`, { text: messagePayload.text });
      socket.emit('send_message', messagePayload);
      setMessages((prev) => [...prev, { ...messagePayload, createdAt: new Date().toISOString() }]);
      setNewMessageText('');
    } catch (err) {
      console.error("Communication payload transmit failure:", err);
    }
  };

  if (localCrashError) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center p-6 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-xs font-semibold">
        ⚠️ Telemetry Error: {localCrashError}
        <div className="mt-4">
          <button onClick={() => window.location.reload()} className="text-indigo-600 underline">Force Reload Dashboard</button>
        </div>
      </div>
    );
  }

  if (loadingChats) {
    return (
      <div className="text-center mt-24 text-xs font-semibold text-gray-400 animate-pulse">
        Initializing encrypted message routing links...
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto h-[75vh] border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden flex text-xs">
      
      {/* LEFT HAND ELEMENT PANEL: Conversational Feed Dashboard Roster */}
      <div className="w-1/3 border-r border-gray-100 flex flex-col bg-gray-50/50">
        <div className="p-4 border-b border-gray-100 bg-white">
          <h2 className="text-sm font-black text-[#121212] tracking-tight">Active Inquiries</h2>
          <p className="text-gray-400 mt-0.5 font-medium">Negotiation channels & custom craft pipelines.</p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {chats.length === 0 ? (
            <div className="text-center py-12 px-4 text-gray-400 font-medium leading-relaxed">
              No negotiations initiated yet. Visit standard item catalogs to drop direct custom inquiries.
            </div>
          ) : (
            chats.map((chat) => {
              if (!chat) return null;
              const currentUserId = user?._id || user?.id;
              const displayPartner = currentUserId === chat.buyer?._id || currentUserId === chat.buyer ? chat.seller : chat.buyer;
              const isSelected = activeChat?._id === chat._id;
              
              return (
                <div
                  key={chat._id}
                  onClick={() => handleSelectChat(chat)}
                  className={`p-4 flex items-start gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-white border-l-4 border-indigo-600' : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <div className="flex justify-between items-baseline">
                      <h4 className="font-bold text-[#121212] truncate">
                        {displayPartner?.sellerDetails?.brandName || displayPartner?.name || 'Artisan Partner'}
                      </h4>
                    </div>
                    <p className="text-indigo-600 font-bold text-[10px] tracking-wide uppercase truncate">
                      📦 {chat.product?.title || 'Custom Commission Asset'}
                    </p>
                    <p className="text-gray-400 font-medium truncate mt-1">
                      {chat.lastMessage || 'Channel established. Open connection dialogue...'}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* RIGHT HAND ELEMENT PANEL: Real-time Communication Dialogue Node Terminal */}
      <div className="flex-1 flex flex-col bg-white">
        {activeChat ? (
          <>
            {/* Active Header Workspace Info */}
            <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
              <div>
                <h3 className="font-black text-sm text-[#121212] tracking-tight">
                  {user && (user._id || user.id) === (activeChat.buyer?._id || activeChat.buyer) ? activeChat.seller?.name || 'Seller' : activeChat.buyer?.name || 'Buyer'}
                </h3>
                <p className="text-gray-400 font-medium mt-0.5">
                  Discussing: <span className="font-bold text-gray-700">{activeChat.product?.title || 'Artwork'}</span> {activeChat.product?.price ? `(Valued at ₹${activeChat.product?.price})` : ''}
                </p>
              </div>
            </div>

            {/* Core Scrolling Timeline Canvas */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/30">
              {loadingMessages ? (
                <div className="text-center text-gray-400 pt-12 animate-pulse font-medium">
                  Loading discussion telemetry layers...
                </div>
              ) : (
                messages.map((msg, index) => {
                  if (!msg) return null;
                  const currentUserId = user?._id || user?.id;
                  const msgSenderId = msg.sender?._id || msg.sender;
                  const isOwnMessage = currentUserId && msgSenderId === currentUserId;
                  
                  return (
                    <div
                      key={msg._id || index}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-xs font-medium text-sm border ${
                          isOwnMessage
                            ? 'bg-[#121212] text-white border-[#121212] rounded-tr-none'
                            : 'bg-white text-gray-800 border-gray-100 rounded-tl-none'
                        }`}
                      >
                        <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form Submission Control Bar */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-100 flex gap-3 bg-white">
              <input
                type="text"
                value={newMessageText}
                onChange={(e) => setNewMessageText(e.target.value)}
                placeholder="Type your counter-valuation offer or custom artisan instructions..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:border-[#121212] text-sm font-medium"
              />
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#121212] text-white font-bold rounded-xl hover:bg-gray-800 transition-colors text-sm"
              >
                Send Message
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 font-medium space-y-1">
            <span className="text-3xl">💬</span>
            <p>Select a negotiation room inquiry card from the sidebar grid roster</p>
            <p className="text-[10px] text-gray-300">to initiate sub-channel WebSocket communication streams.</p>
          </div>
        )}
      </div>

    </div>
  );
}

export default Messages;