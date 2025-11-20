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
}

const LeftPanel: React.FC<LeftPanelProps> = ({
    chats,
    activeChatId,
    onSelectChat,
    allSuggestions,
    onAcceptAction,
    onDismissAction
}) => {
    const [activeTab, setActiveTab] = useState<'MESSAGES' | 'ACTIONS'>('MESSAGES');

    return (
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col h-full">
            {/* Header Tabs */}
            <div className="flex border-b border-gray-200 bg-gray-50">
                <button
                    onClick={() => setActiveTab('MESSAGES')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors ${activeTab === 'MESSAGES'
                        ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <MessageSquare size={18} />
                    Messages
                </button>
                <button
                    onClick={() => setActiveTab('ACTIONS')}
                    className={`flex-1 py-4 text-sm font-bold flex items-center justify-center gap-2 transition-colors relative ${activeTab === 'ACTIONS'
                        ? 'bg-white text-indigo-600 border-b-2 border-indigo-600'
                        : 'text-gray-500 hover:text-gray-700'
                        }`}
                >
                    <Zap size={18} />
                    Action Center
                    {allSuggestions.length > 0 && (
                        <span className="ml-1 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                            {allSuggestions.length}
                        </span>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden relative">
                {activeTab === 'MESSAGES' ? (
                    <ChatList
                        chats={chats}
                        activeChatId={activeChatId}
                        onSelectChat={onSelectChat}
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
