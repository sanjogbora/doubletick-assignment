
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import RightPanel from './components/RightPanel';
import ScheduleModal from './components/ScheduleModal';
import { MOCK_CHATS, MOCK_AI_SUGGESTIONS } from './constants';
import { Chat, Message, MessageSender, MessageType, AISuggestion, ActionType } from './types';

const App: React.FC = () => {
  // State
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_1');
  
  // Modal State
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>(null);

  // Derived State
  const activeChat = chats.find(c => c.id === activeChatId) || null;
  
  // In a real app, these would be fetched from a backend/AI service
  const currentSuggestions = activeChatId ? (MOCK_AI_SUGGESTIONS[activeChatId] || []) : [];

  // Handlers
  const handleSendMessage = (text: string) => {
    if (!activeChatId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: text,
      sender: MessageSender.USER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: MessageType.TEXT
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));
  };

  const handleAIAccept = (id: string, action: ActionType, payload: any) => {
      const suggestion = currentSuggestions.find(s => s.id === id);

      if (action === ActionType.SCHEDULE_FOLLOWUP) {
          // Open Modal
          setActiveSuggestion(suggestion || null);
          setScheduleModalOpen(true);
      } else if (action === ActionType.SEND_TEMPLATE) {
          // Direct Action
          handleSendMessage(`[SYSTEM: Sent Template - ${payload.templateName}]`);
          // Logic to remove suggestion or mark done would go here
      }
  };

  const handleConfirmSchedule = (details: any) => {
      handleSendMessage(`[SYSTEM: Scheduled Call for ${details.date} at ${details.time}]`);
      setScheduleModalOpen(false);
      // Here we would update the backend to remove the suggestion
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* 1. Left Sidebar (Navigation) */}
      <Sidebar />

      {/* 2. Chat List (Inbox) */}
      <ChatList 
        chats={chats} 
        activeChatId={activeChatId} 
        onSelectChat={setActiveChatId} 
      />

      {/* 3. Main Chat Window */}
      <ChatWindow 
        chat={activeChat} 
        aiSuggestions={currentSuggestions}
        onSendMessage={handleSendMessage}
        onAIAccept={handleAIAccept}
      />

      {/* 4. Right Panel (Details) */}
      <RightPanel contact={activeChat?.contact || null} />

      {/* 5. Modals */}
      <ScheduleModal 
        isOpen={isScheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onConfirm={handleConfirmSchedule}
        suggestion={activeSuggestion}
      />
      
      {/* Mobile Overlay for small screens warning */}
      <div className="lg:hidden fixed inset-0 bg-black/80 z-50 flex items-center justify-center text-white p-8 text-center backdrop-blur-md md:hidden">
          <div>
              <h2 className="text-xl font-bold mb-2">Desktop Preview Only</h2>
              <p>The prototype is optimized for the Web Interface requirement. Please view on a larger screen.</p>
          </div>
      </div>
    </div>
  );
};

export default App;
