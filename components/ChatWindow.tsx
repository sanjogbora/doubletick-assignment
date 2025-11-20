
import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Send, Smile, MoreVertical, Phone, Video, Search, Mic, FileText } from 'lucide-react';
import { Chat, MessageSender, MessageType, AISuggestion, ActionType } from '../types';
import AIActionPanel from './AIActionPanel';

interface ChatWindowProps {
  chat: Chat | null;
  aiSuggestions: AISuggestion[];
  onSendMessage: (text: string) => void;
  onAIAccept?: (id: string, action: ActionType, payload: any) => void;
  onProfileClick?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chat, aiSuggestions, onSendMessage, onAIAccept, onProfileClick }) => {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isAIPanelMinimized, setIsAIPanelMinimized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSuggestions(aiSuggestions);
  }, [aiSuggestions]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat?.messages, suggestions]);

  if (!chat) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#f0f2f5] border-r border-gray-200">
        <div className="bg-white p-8 rounded-full shadow-sm mb-4">
          <img src="https://cdn-icons-png.flaticon.com/512/2702/2702602.png" alt="Select Chat" className="w-20 h-20 opacity-50" />
        </div>
        <h3 className="text-gray-500 font-medium text-lg">Select a conversation to start working</h3>
        <p className="text-gray-400 text-sm mt-2">Converso AI is ready to assist you.</p>
      </div>
    );
  }

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleAIAcceptWrapper = (id: string, action: ActionType, payload: any) => {
    if (onAIAccept) {
      onAIAccept(id, action, payload);
    } else {
      // Fallback for internal handling if no prop provided (backward compatibility)
      if (action === ActionType.SEND_TEMPLATE) {
        onSendMessage(`[SENT TEMPLATE: ${payload.templateName}]`);
      }
      setSuggestions(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleAIDismiss = (id: string) => {
    setSuggestions(prev => prev.filter(s => s.id !== id));
  };

  const handleAIEdit = (id: string) => {
    const sugg = suggestions.find(s => s.id === id);
    if (sugg) alert(`Edit mode for: ${sugg.title}`);
  };

  return (
    <div className="flex-1 flex flex-col bg-[#efe7dd] relative min-w-[400px]">
      {/* Chat Header */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 flex-shrink-0 z-10 shadow-sm relative">
        <div className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors" onClick={onProfileClick}>
          <img src={chat.contact.avatar} alt={chat.contact.name} className="w-10 h-10 rounded-full" />
          <div>
            <h3 className="font-semibold text-gray-800">{chat.contact.name}</h3>
            <p className="text-xs text-gray-500">
              {chat.contact.leadStage} • Last active {chat.contact.lastActive}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-500">
          <Search size={20} className="cursor-pointer hover:text-emerald-600" />
          <Phone size={20} className="cursor-pointer hover:text-emerald-600" />
          <MoreVertical size={20} className="cursor-pointer hover:text-emerald-600" />
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-repeat bg-opacity-10 relative scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
        <div className="flex flex-col gap-2 pb-20">
          {/* Date Separator */}
          <div className="flex justify-center my-4">
            <span className="bg-white/80 backdrop-blur-sm text-gray-500 text-xs px-3 py-1 rounded-md shadow-sm border border-gray-100">Today</span>
          </div>

          {chat.messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === MessageSender.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[70%] rounded-lg px-3 py-1.5 shadow-sm text-sm relative group ${msg.sender === MessageSender.USER
                  ? 'bg-[#d9fdd3] text-gray-800 rounded-tr-none'
                  : 'bg-white text-gray-800 rounded-tl-none'
                  }`}
              >
                {msg.content.includes('[SYSTEM: Sent Template -') || msg.content.includes('[SYSTEM: Scheduled Call') ? (
                  msg.content.includes('[SYSTEM: Sent Template -') ? (
                    // WhatsApp-style PDF Message
                    <div className="flex flex-col gap-0 min-w-[260px] max-w-[260px]">
                      {/* PDF Preview Thumbnail */}
                      <div className="relative bg-gradient-to-br from-red-50 to-orange-50 rounded-t-lg p-4 border-b border-red-100">
                        <div className="flex items-center justify-center">
                          <div className="relative">
                            <div className="w-16 h-20 bg-white rounded shadow-md flex items-center justify-center border border-red-100">
                              <FileText size={32} className="text-red-500" />
                            </div>
                            {/* PDF Badge */}
                            <div className="absolute -bottom-1 -right-1 bg-red-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full shadow">
                              PDF
                            </div>
                          </div>
                        </div>
                      </div>
                      {/* File Info */}
                      <div className="bg-white/80 px-3 py-2 rounded-b-lg">
                        <div className="flex items-start gap-2">
                          <FileText size={18} className="text-red-500 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm truncate leading-tight text-gray-800">
                              {msg.content.split(' - ')[1].replace(']', '')}
                            </p>
                            <p className="text-[10px] text-gray-500 mt-0.5">PDF Document • 1.2 MB</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Scheduled Call Message
                    <div className="flex items-center gap-2 bg-indigo-50/50 px-3 py-2 rounded-lg min-w-[240px]">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                        <Phone size={16} />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-medium text-gray-800">Call Scheduled</p>
                        <p className="text-[10px] text-gray-500">{msg.content.split('for ')[1].replace(']', '')}</p>
                      </div>
                    </div>
                  )
                ) : (
                  <p className="leading-relaxed">{msg.content}</p>
                )}
                <span className={`text-[10px] absolute bottom-1 right-2 ${msg.sender === MessageSender.USER ? 'text-emerald-700' : 'text-gray-400'
                  }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AIActionPanel
        suggestions={suggestions}
        onAccept={handleAIAcceptWrapper}
        onDismiss={handleAIDismiss}
        onEdit={handleAIEdit}
        minimized={isAIPanelMinimized}
        onToggleMinimize={() => setIsAIPanelMinimized(!isAIPanelMinimized)}
        className={isAIPanelMinimized
          ? "absolute top-3 right-16 z-50" // Header Badge Position
          : "absolute bottom-[70px] left-4 right-4 z-20" // Bottom Panel Position
        }
      />

      {/* Input Area */}
      <div className="bg-white px-4 py-3 flex items-center gap-3 border-t border-gray-200 flex-shrink-0 z-30">
        <button className="text-gray-500 hover:text-gray-600">
          <Smile size={24} />
        </button>
        <button className="text-gray-500 hover:text-gray-600">
          <Paperclip size={24} />
        </button>
        <div className="flex-1 relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message"
            className="w-full bg-gray-100 border border-transparent focus:bg-white focus:border-emerald-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none transition-all"
          />
        </div>
        {input.trim() ? (
          <button onClick={handleSend} className="text-emerald-600 hover:text-emerald-700 transition-transform transform active:scale-95">
            <Send size={24} />
          </button>
        ) : (
          <button className="text-gray-500 hover:text-gray-600">
            <Mic size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatWindow;
