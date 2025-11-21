import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import ChatList from './components/ChatList';
import ChatWindow from './components/ChatWindow';
import RightPanel from './components/RightPanel';
import ScheduleModal from './components/ScheduleModal';
import EscalationModal from './components/EscalationModal';
import { MOCK_CHATS, MOCK_AI_SUGGESTIONS } from './constants';
import { Chat, Message, MessageSender, MessageType, AISuggestion, ActionType } from './types';

import LeftPanel from './components/LeftPanel';

const App: React.FC = () => {
  // State
  const [chats, setChats] = useState<Chat[]>(MOCK_CHATS);
  const [activeChatId, setActiveChatId] = useState<string | null>('chat_1');

  // Initialize suggestions state from mock data
  const [aiSuggestionsMap, setAiSuggestionsMap] = useState<Record<string, AISuggestion[]>>(MOCK_AI_SUGGESTIONS);

  // Modal State
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [isEscalationModalOpen, setEscalationModalOpen] = useState(false);
  const [isRightPanelOpen, setRightPanelOpen] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState<AISuggestion | null>(null);

  // Navigation State
  const [activeView, setActiveView] = useState<'MESSAGES' | 'ACTIONS'>('MESSAGES');

  // Derived State
  const activeChat = chats.find(c => c.id === activeChatId) || null;

  // Get current suggestions from state
  const currentSuggestions = activeChatId ? (aiSuggestionsMap[activeChatId] || []) : [];

  // Aggregate all suggestions for Action Center from state
  const allSuggestions = Object.keys(aiSuggestionsMap).flatMap(chatId => {
    const chat = chats.find(c => c.id === chatId);
    return aiSuggestionsMap[chatId].map(suggestion => ({
      chatId,
      contactName: chat?.contact.name || 'Unknown',
      contactAvatar: chat?.contact.avatar,
      suggestion
    }));
  });

  const chatsWithSuggestions = new Map(
    Object.keys(aiSuggestionsMap)
      .filter(id => aiSuggestionsMap[id].length > 0)
      .map(id => [id, aiSuggestionsMap[id].map(s => ({ type: s.actionType, priority: s.priority }))])
  );

  const hasAnySuggestions = allSuggestions.length > 0;

  // Handlers
  const handleSendMessage = (text: string, chatId?: string, type: MessageType = MessageType.TEXT, payload?: any) => {
    const targetChatId = chatId || activeChatId;
    if (!targetChatId) return;

    const newMessage: Message = {
      id: Date.now().toString() + Math.random().toString(),
      content: text,
      sender: MessageSender.USER,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: type,
      payload: payload
    };

    setChats(prevChats => prevChats.map(chat => {
      if (chat.id === targetChatId) {
        return {
          ...chat,
          messages: [...chat.messages, newMessage]
        };
      }
      return chat;
    }));
  };

  const removeSuggestion = (chatId: string, suggestionId: string) => {
    setAiSuggestionsMap(prev => {
      const newMap = { ...prev };
      if (newMap[chatId]) {
        newMap[chatId] = newMap[chatId].filter(s => s.id !== suggestionId);
      }
      return newMap;
    });
  };

  const handleAIAccept = (id: string, action: ActionType, payload: any, options?: { navigate?: boolean, chatId?: string }) => {
    // Find suggestion across all chats if needed, or use current
    let suggestion = currentSuggestions.find(s => s.id === id);
    let targetChatId = options?.chatId || activeChatId;

    if (!suggestion) {
      // Search in all suggestions
      const found = allSuggestions.find(s => s.suggestion.id === id);
      if (found) {
        suggestion = found.suggestion;
        targetChatId = found.chatId;
      }
    }

    if (!targetChatId) return;

    if (action === ActionType.SCHEDULE_FOLLOWUP) {
      // Open Modal
      setActiveSuggestion(suggestion || null);
      setScheduleModalOpen(true);
    } else if (action === ActionType.ESCALATE) {
      // Open Escalation Modal
      setActiveSuggestion(suggestion || null);
      setEscalationModalOpen(true);
    } else if (action === ActionType.SEND_TEMPLATE) {
      // Direct Action
      // Check if it's a PDF template and send a PDF message type if possible
      const templateName = payload.templateName || 'Document.pdf';
      if (templateName.toLowerCase().endsWith('.pdf') || templateName.includes('Catalog') || templateName.includes('Brochure')) {
        handleSendMessage(templateName, targetChatId, MessageType.PDF);
      } else {
        handleSendMessage(`[SYSTEM: Sent Template - ${templateName}]`, targetChatId);
      }
      // Remove suggestion immediately for direct actions
      removeSuggestion(targetChatId, id);
    }
  };

  const handleGlobalAccept = (chatId: string, suggestionId: string, action: ActionType, payload: any) => {
    if (action === ActionType.SCHEDULE_FOLLOWUP || action === ActionType.ESCALATE) {
      handleAIAccept(suggestionId, action, payload, { navigate: false, chatId });
    } else {
      handleAIAccept(suggestionId, action, payload, { navigate: false, chatId });
    }
  };

  const handleGlobalDismiss = (chatId: string, suggestionId: string) => {
    console.log(`Dismissed suggestion ${suggestionId} for chat ${chatId}`);
    removeSuggestion(chatId, suggestionId);
  };

  const handleConfirmSchedule = (details: any) => {
    if (activeSuggestion) {
      // Find which chat this suggestion belongs to
      const found = allSuggestions.find(s => s.suggestion.id === activeSuggestion.id);
      if (found) {
        handleSendMessage(`Scheduled Call`, found.chatId, MessageType.SCHEDULE, details);
        removeSuggestion(found.chatId, activeSuggestion.id);
      }
    }
    setScheduleModalOpen(false);
  };

  const handleConfirmEscalation = (note: string) => {
    if (activeSuggestion) {
      const found = allSuggestions.find(s => s.suggestion.id === activeSuggestion.id);
      if (found) {
        handleSendMessage(`[SYSTEM: Ticket Escalated. Note: ${note}]`, found.chatId, MessageType.TEXT);
        removeSuggestion(found.chatId, activeSuggestion.id);
      }
    }
    setEscalationModalOpen(false);
  };

  return (
    <div className="flex h-screen w-screen bg-gray-50 overflow-hidden font-sans text-gray-900">
      {/* 1. Left Sidebar (Navigation) */}
      <Sidebar
        activeView={activeView}
        onViewChange={setActiveView}
        hasSuggestions={hasAnySuggestions}
      />

      {/* 2. Left Panel (Tabs: Messages / Action Center) */}
      <LeftPanel
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        allSuggestions={allSuggestions}
        onAcceptAction={handleGlobalAccept}
        onDismissAction={handleGlobalDismiss}
        activeView={activeView}
        chatsWithSuggestions={chatsWithSuggestions}
      />

      {/* 3. Main Chat Window */}
      <ChatWindow
        chat={activeChat}
        aiSuggestions={currentSuggestions}
        onSendMessage={(text) => handleSendMessage(text)}
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

      <EscalationModal
        isOpen={isEscalationModalOpen}
        onClose={() => setEscalationModalOpen(false)}
        onConfirm={handleConfirmEscalation}
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
