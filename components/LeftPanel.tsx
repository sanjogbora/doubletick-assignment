import React, { useState } from 'react';
import { MessageSquare, Zap } from 'lucide-react';
import ChatList from './ChatList';
import UnifiedActionCenter from './UnifiedActionCenter';
import { Chat, AISuggestion, ActionType } from '../types';

interface LeftPanelProps {
    chats: Chat[];
    activeChatId: string | null;
    onSelectChat: (id: string) => void;
    allSuggestions: { chatId: string; contactName: string; contactAvatar?: string; suggestion: AISuggestion }[];
    onAcceptAction: (chatId: string, suggestionId: string, action: ActionType, payload: any) => void;
    onDismissAction: (chatId: string, suggestionId: string) => void;
    activeView: 'MESSAGES' | 'ACTIONS';
    chatsWithSuggestions: Set<string>;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    allSuggestions,
    onAcceptAction,
    onDismissAction,
    activeView,
    chatsWithSuggestions
}) => {
    return (
        <div className="w-96 bg-white flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {activeView === 'MESSAGES' ? (
                    <ChatList
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={onSelectChat}
                        chatsWithSuggestions={chatsWithSuggestions}
                    />
                ) : (
                    <UnifiedActionCenter
                        isOpen={true} // Always open when tab is active
                        onClose={() => { }} // No close button needed in tab mode
                        allSuggestions={allSuggestions}
                        onAccept={onAcceptAction}
                        onDismiss={onDismissAction}
                        isTabMode={true} // New prop to adjust styling
                    />
                )}
            </div>
        </div>
    );
};

export default LeftPanel;
