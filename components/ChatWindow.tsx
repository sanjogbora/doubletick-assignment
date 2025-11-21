import React, { useState } from 'react';
import { X, Send, Paperclip, Smile, MoreVertical, Phone, Video, Search, ChevronLeft, FileText, Calendar } from 'lucide-react';
import { Chat, Message, MessageSender, MessageType, AISuggestion, ActionType } from '../types';
import AIActionPanel from './AIActionPanel';

interface ChatWindowProps {
  chat: Chat | null;
  aiSuggestions?: AISuggestion[];
  onSendMessage: (text: string) => void;
  onAIAccept: (id: string, action: ActionType, payload: any) => void;
  onProfileClick: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, aiSuggestions = [], onSendMessage, onAIAccept, onProfileClick }) => {
  const [inputValue, setInputValue] = useState('');
  const [isAIPanelMinimized, setIsAIPanelMinimized] = useState(false);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50/50">
        <div className="text-center text-gray-400">
          <p>Select a chat to start messaging</p>
        </div>
      </div>
    );
  }

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage(inputValue);
      setInputValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full relative bg-[#efeae2]">
      {/* Chat Header */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-gray-200 z-10 shadow-sm">
        <div className="flex items-center gap-3 cursor-pointer" onClick={onProfileClick}>
          <div className="relative">
            <img
              src={chat.contact.avatar || `https://ui-avatars.com/api/?name=${chat.contact.name}`}
              alt={chat.contact.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{chat.contact.name}</h3>
            <p className="text-xs text-gray-500">Online</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-gray-600">
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors"><Search size={20} /></button>
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors"><Phone size={20} /></button>
          <button className="hover:bg-gray-100 p-2 rounded-full transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-5">
        {chat.messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-3 py-2 shadow-sm relative text-sm ${msg.sender === MessageSender.USER
                ? 'bg-emerald-100 text-gray-800 rounded-tr-none'
                : 'bg-white text-gray-800 rounded-tl-none'
                }`}
            >
              {msg.type === MessageType.PDF ? (
                msg.sender === MessageSender.USER ? (
                  // Sent PDF
                  <div className="flex items-center gap-3 p-1 min-w-[240px]">
                    <div className="w-10 h-12 bg-red-50 rounded flex items-center justify-center flex-shrink-0 border border-red-100">
                      <FileText className="text-red-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-gray-800">{msg.content}</p>
                      <p className="text-xs text-gray-500">2.4 MB • PDF</p>
                    </div>
                    <span className={`text-[10px] self-end ${msg.sender === MessageSender.USER ? 'text-emerald-700' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                ) : (
                  // Received PDF
                  <div className="flex items-center gap-3 p-1 min-w-[240px]">
                    <div className="w-10 h-12 bg-red-50 rounded flex items-center justify-center flex-shrink-0 border border-red-100">
                      <FileText className="text-red-500" size={24} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate text-gray-800">Document.pdf</p>
                      <p className="text-xs text-gray-500">PDF</p>
                    </div>
                    <span className={`text-[10px] self-end ${msg.sender === MessageSender.USER ? 'text-emerald-700' : 'text-gray-400'}`}>
                      {msg.timestamp}
                    </span>
                  </div>
                )
              ) : msg.type === MessageType.SCHEDULE ? (
                <div className="min-w-[240px]">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-800">Scheduled Call</p>
                      <p className="text-sm text-gray-600">{msg.payload?.date || 'Tomorrow'}, {msg.payload?.time || '10:00 AM'}</p>
                      <p className="text-xs text-gray-500 mt-0.5">WhatsApp voice call</p>
                    </div>
                  </div>
                  <div className="border-t border-emerald-200/50 pt-2 mt-2">
                    <button className="w-full text-center text-emerald-700 font-semibold text-sm py-1 hover:bg-emerald-50 rounded transition-colors">
                      Edit
                    </button>
                  </div>
                  <span className={`text-[10px] absolute bottom-1 right-2 ${msg.sender === MessageSender.USER ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              ) : (
                <div className="flex flex-wrap items-end gap-x-2 gap-y-0">
                  <p className="leading-relaxed">{msg.content}</p>
                  <span className={`text-[10px] ml-auto ${msg.sender === MessageSender.USER ? 'text-emerald-700' : 'text-gray-400'}`}>
                    {msg.timestamp}
                  </span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* AI Action Panel (Floating) */}
      <AIActionPanel
        suggestions={aiSuggestions}
        onAccept={onAIAccept}
        onDismiss={() => { }}
        onEdit={() => { }}
        minimized={isAIPanelMinimized}
        onToggleMinimize={() => setIsAIPanelMinimized(!isAIPanelMinimized)}
        className={isAIPanelMinimized
          ? "absolute top-3.5 right-[160px] z-50" // Header Badge Position - Adjusted to be left of icons
          : "absolute bottom-[70px] left-4 right-4 z-20" // Bottom Panel Position
        }
      />

      {/* Input Area */}
      <div className="bg-white px-4 py-3 flex items-center gap-2 border-t border-gray-200 z-30">
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <Smile size={24} />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
          <Paperclip size={24} />
        </button>

        <div className="flex-1 relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message"
            className="w-full py-2 px-4 bg-gray-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>

        <button
          onClick={handleSend}
          className={`p-2 rounded-full transition-all ${inputValue.trim()
            ? 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-md'
            : 'bg-gray-100 text-gray-400'
            }`}
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
