
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import RightPanel from './components/RightPanel';
import ScheduleModal from './components/ScheduleModal';
import { MOCK_CHATS, MOCK_AI_SUGGESTIONS } from './constants';
import { Chat, Message, MessageSender, MessageType, AISuggestion, ActionType } from './types';

import LeftPanel from './components/LeftPanel';

const App: React.FC = () => {
  // State
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_1');

  // Modal State
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>(null);

  // Derived State
  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // In a real app, these would be fetched from a backend/AI service
  const currentSuggestions = activeChatId ? (MOCK_AI_SUGGESTIONS[activeChatId] || []) : [];

  // Aggregate all suggestions for Action Center
  const allSuggestions = Object.keys(MOCK_AI_SUGGESTIONS).flatMap(chatId => {
    const chat = chats.find(c => c.id === chatId);
    return MOCK_AI_SUGGESTIONS[chatId].map(suggestion => ({
      chatId,
      contactName: chat?.contact.name || 'Unknown',
      contactAvatar: chat?.contact.avatar,
      suggestion
    }));
  });

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
    // Find suggestion across all chats if needed, or use current
    let suggestion = currentSuggestions.find(s => s.id === id);

    if (!suggestion) {
      // Search in all suggestions
      const found = allSuggestions.find(s => s.suggestion.id === id);
      if (found) suggestion = found.suggestion;
    }

    if (action === ActionType.SCHEDULE_FOLLOWUP) {
      // Open Modal
      setActiveSuggestion(suggestion || null);
      setScheduleModalOpen(true);
    } else if (action === ActionType.SEND_TEMPLATE) {
      // Direct Action
      // Check if it's a PDF template and send a PDF message type if possible, or formatted text
      // For now, we'll send a formatted text that ChatWindow will render specially
      handleSendMessage(`[SYSTEM: Sent Template - ${payload.templateName}]`);
    }
  };

  const handleGlobalAccept = (chatId: string, suggestionId: string, action: ActionType, payload: any) => {
    setActiveChatId(chatId); // Switch to that chat
    handleAIAccept(suggestionId, action, payload);
  };

  const handleGlobalDismiss = (chatId: string, suggestionId: string) => {
    console.log(`Dismissed suggestion ${suggestionId} for chat ${chatId}`);
    // In real app, update state to remove suggestion
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

      {/* 2. Left Panel (Tabs: Messages / Action Center) */}
      <LeftPanel
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        allSuggestions={allSuggestions}
        onAcceptAction={handleGlobalAccept}
        onDismissAction={handleGlobalDismiss}
      />

      {/* 3. Main Chat Window */}
      <ChatWindow
        chat={activeChat}
        aiSuggestions={currentSuggestions}
        onSendMessage={handleSendMessage}
        onAIAccept={handleAIAccept}
        onProfileClick={() => setRightPanelOpen(!isRightPanelOpen)}
      />

      {/* 4. Right Panel (Details) */}
      {isRightPanelOpen && <RightPanel contact={activeChat?.contact || null} />}

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
