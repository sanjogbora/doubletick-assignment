import React, { useState } from 'react';
import { Search, Filter, CheckCircle2 } from 'lucide-react';
import { Chat, LeadStage } from '../types';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

const ChatList: React.FC<ChatListProps> = ({ chats, activeChatId, onSelectChat }) => {
  const [filter, setFilter] = useState('All');

  // Simple categorization for the UI tabs
  const filters = ['All', 'Unread', 'Hot', 'Warm'];

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-800 text-lg">Inbox</h2>
          <div className="flex gap-2">
            <button className="p-1.5 hover:bg-gray-100 rounded-md text-gray-500">
                <img src="https://upload.wikimedia.org/wikipedia/commons/8/82/Telegram_logo.svg" className="w-5 h-5 opacity-50 grayscale" alt="channel" />
            </button>
             <button className="p-1.5 bg-emerald-50 rounded-md text-emerald-600">
                <MessageSquareIcon className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search" 
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex px-4 py-2 gap-2 overflow-x-auto scrollbar-hide border-b border-gray-100">
        {filters.map(f => (
          <button 
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              filter === f 
                ? 'bg-emerald-100 text-emerald-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {f} {f === 'All' && <span className="ml-1 opacity-60">{chats.length}</span>}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
            const lastMsg = chat.messages[chat.messages.length - 1];
            const isActive = chat.id === activeChatId;

            return (
            <div 
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`flex items-start gap-3 p-4 border-b border-gray-50 cursor-pointer hover:bg-gray-50 transition-colors ${isActive ? 'bg-emerald-50/60 hover:bg-emerald-50/80 border-l-4 border-l-emerald-500' : 'border-l-4 border-l-transparent'}`}
            >
                <div className="relative">
                    <img 
                        src={chat.contact.avatar || `https://ui-avatars.com/api/?name=${chat.contact.name}`} 
                        alt={chat.contact.name} 
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    {chat.contact.source === 'Website' && (
                         <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                            <div className="w-4 h-4 bg-emerald-500 rounded-full flex items-center justify-center">
                                <CheckCircle2 size={10} color="white" />
                            </div>
                         </div>
                    )}
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                        <h3 className={`text-sm truncate ${isActive ? 'font-semibold text-emerald-900' : 'font-medium text-gray-900'}`}>
                            {chat.contact.name}
                        </h3>
                        <span className="text-[10px] text-gray-400">{lastMsg?.timestamp}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate pr-2">
                        {lastMsg?.sender === 'user' && 'You: '}
                        {lastMsg?.content}
                    </p>
                    
                    <div className="flex gap-1 mt-2">
                        {chat.contact.leadStage === LeadStage.HOT && (
                             <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[10px] rounded font-medium">Hot</span>
                        )}
                         {chat.unreadCount > 0 && (
                            <span className="ml-auto bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                                {chat.unreadCount}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            )
        })}
      </div>
    </div>
  );
};

const MessageSquareIcon = (props: any) => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
    </svg>
)

export default ChatList;