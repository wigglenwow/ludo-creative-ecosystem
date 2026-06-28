import React, { useState } from 'react';
import SmartGuide from '../components/SmartGuide';

function ChatRoom() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'client', text: 'Hey! I love your textured resin keychain things. Can you make a custom set shaped like mini guitar bodies?' },
    { id: 2, sender: 'artist', text: 'Absolutely! I can mold those easily. Do you want them translucent with gold leaf fillings or solid color gradients?' },
    { id: 3, sender: 'client', text: 'Translucent with gold leaf sounds perfect! I need about 5 of them.' }
  ]);
  const [inputText, setInputText] = useState('');

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'artist',
      text: inputText
    }]);
    setInputText('');
  };

  return (
    <div className="space-y-6 mt-4 animate-fadeIn">
      
      {/* Dynamic Workspace Title Header */}
      <div>
        <h2 className="text-2xl font-black tracking-tight text-[#121212]">LUDO Communications Hub</h2>
        <p className="text-gray-400 text-xs mt-0.5">Active conversations and design alignment channels.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Columns (2 Spans): The Messaging Screen */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-xl shadow-sm flex flex-col h-[500px]">
          
          {/* Active Contact Header Bar */}
          <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 rounded-t-xl">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-800">
                RS
              </div>
              <div>
                <span className="font-bold text-sm block text-gray-800">Rohan Sharma</span>
                <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                  <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1"></span> Online
                </span>
              </div>
            </div>
            <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-0.5 rounded">Order #2026-A</span>
          </div>

          {/* Active Message Timeline Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs bg-gray-50/30">
            {messages.map(msg => (
              <div 
                key={msg.id} 
                className={`max-w-[70%] p-3 rounded-xl text-sm leading-relaxed ${
                  msg.sender === 'artist' 
                    ? 'bg-[#121212] text-white rounded-tr-none ml-auto text-left shadow-2xs' 
                    : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
            ))}
          </div>

          {/* Interactive Chat Footer Submittor */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center space-x-2 rounded-b-xl">
            <input 
              type="text" 
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Discuss dimensions, mediums, or timelines..." 
              className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2.5 text-xs focus:outline-none focus:border-[#121212] transition-colors font-medium"
            />
            <button 
              type="submit"
              className="px-5 py-2.5 bg-[#121212] text-white text-xs font-bold rounded-lg hover:bg-gray-800 transition-all shadow-sm"
            >
              Send Message
            </button>
          </form>

        </div>

        {/* Right Column (1 Span): The Context Guide Companion */}
        <div className="flex justify-center w-full">
          <SmartGuide />
        </div>

      </div>

    </div>
  );
}

export default ChatRoom;