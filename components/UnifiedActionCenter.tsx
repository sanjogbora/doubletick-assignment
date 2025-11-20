
import React, { useState } from 'react';
import { X, Check, Clock, AlertCircle, FileText, Filter, Search, ArrowRight, Calendar, Users, Sparkles, CheckCircle } from 'lucide-react';
import { AISuggestion, PriorityLevel, ActionType, Chat } from '../types';

interface UnifiedActionCenterProps {
    isOpen: boolean;
    onClose: () => void;
    allSuggestions: { chatId: string; contactName: string; contactAvatar?: string; suggestion: AISuggestion }[];
    onAccept: (chatId: string, suggestionId: string, action: ActionType, payload: any) => void;
    onDismiss: (chatId: string, suggestionId: string) => void;
    isTabMode?: boolean;
}

const UnifiedActionCenter: React.FC<UnifiedActionCenterProps> = ({
    isOpen,
    onClose,
    allSuggestions,
    onAccept,
    onDismiss,
    isTabMode = false
}) => {
    const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

    if (!isOpen && !isTabMode) return null; // Only return null if not in tab mode and not open

    const filteredSuggestions = allSuggestions.filter(item => {
        if (filter === 'ALL') return true;
        return item.suggestion.priority === (filter === 'HIGH' ? PriorityLevel.HIGH : filter === 'MEDIUM' ? PriorityLevel.MEDIUM : PriorityLevel.LOW);
    });

    // Group suggestions by Chat ID
    const groupedByChat = filteredSuggestions.reduce((acc, item) => {
        if (!acc[item.chatId]) {
            acc[item.chatId] = {
                chatId: item.chatId,
                contactName: item.contactName,
                contactAvatar: item.contactAvatar,
                suggestions: []
            };
        }
        acc[item.chatId].suggestions.push(item.suggestion);
        return acc;
    }, {} as Record<string, { chatId: string; contactName: string; contactAvatar?: string; suggestions: AISuggestion[] }>);

    const getIcon = (type: ActionType) => {
        switch (type) {
            case ActionType.SCHEDULE_FOLLOWUP: return <Clock size={16} />;
            case ActionType.SEND_TEMPLATE: return <FileText size={16} />;
            case ActionType.ESCALATE: return <AlertCircle size={16} />;
            default: return <ArrowRight size={16} />;
        }
    };

    const containerClass = isTabMode
        ? "h-full flex flex-col bg-gray-50"
        : "fixed inset-y-0 left-[64px] w-96 bg-white shadow-2xl z-40 border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col";

    return (
        <div className={containerClass}>
            {/* Header - Only show in Drawer Mode or show Filters in Tab Mode */}
            <div className="p-4 border-b border-gray-100 bg-white">
                {!isTabMode && (
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            Action Center
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                )}

                <div className="flex items-center justify-between gap-2">
                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`text - [10px] font - bold px - 2.5 py - 1 rounded - full border transition - colors whitespace - nowrap ${filter === f
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                    } `}
                            >
                                {f}
                            </button>
                        ))}
                    </div>

                    {/* Accept All Button */}
                    {isTabMode && filteredSuggestions.length > 0 && (
                        <button className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 whitespace-nowrap">
                            <CheckCircle size={12} />
                            Accept All
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Smart Group Actions (Demo) - Updated Design */}
                {filter === 'ALL' && (
                    <div className="bg-white rounded-xl p-4 border border-indigo-100 shadow-sm relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-indigo-500 to-purple-500"></div>

                        <div className="flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-indigo-600" />
                            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">Smart Opportunity</span>
                        </div>

                        <h3 className="font-bold text-gray-900 text-sm mb-1">Send Pricing PDF to Interested Leads</h3>
                        <p className="text-gray-500 text-xs mb-4">3 leads requested pricing recently.</p>

                        {/* Stacked Avatars */}
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex -space-x-2">
                                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?u=zoya" alt="" />
                                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?u=rahul" alt="" />
                                <img className="w-8 h-8 rounded-full border-2 border-white" src="https://i.pravatar.cc/150?u=priya" alt="" />
                            </div>
                            <span className="text-xs text-gray-400">+2 others</span>
                        </div>

                        <button className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2.5 rounded-lg shadow-sm transition-colors w-full flex items-center justify-center gap-2">
                            <FileText size={14} />
                            Broadcast to All 3
                        </button>
                    </div>
                )}

                {Object.values(groupedByChat).length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <Check size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>All caught up!</p>
                    </div>
                ) : (
                    Object.values(groupedByChat).map(({ chatId, contactName, contactAvatar, suggestions }) => (
                        <div key={chatId} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {/* Group Header */}
                            <div className="bg-gray-50 px-3 py-2 border-b border-gray-100 flex items-center gap-2">
                                <img
                                    src={contactAvatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contactName)}&background=random`}
                                    alt={contactName}
                                    className="w-6 h-6 rounded-full object-cover"
                                />
                                <span className="text-xs font-bold text-gray-700">{contactName}</span>
                                <span className="text-[10px] text-gray-400 ml-auto">{suggestions.length} actions</span>
                            </div >

                            {/* Suggestions List */}
                            < div className="divide-y divide-gray-100" >
                                {
                                    suggestions.map(suggestion => (
                                        <div key={suggestion.id} className="p-3 hover:bg-gray-50 transition-colors">
                                            <div className="flex justify-between items-start mb-1">
                                                <div className="flex items-center gap-2">
                                                    <div className={`p-1 rounded ${suggestion.priority === PriorityLevel.HIGH ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                                        {getIcon(suggestion.actionType)}
                                                    </div>
                                                    <h4 className="text-xs font-bold text-gray-800">{suggestion.title}</h4>
                                                </div>
                                                {suggestion.priority === PriorityLevel.HIGH && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                )}
                                            </div>
                                            <p className="text-[10px] text-gray-500 mb-2 pl-7">{suggestion.description}</p>

                                            <div className="flex items-center justify-end gap-2 pl-7">
                                                <button
                                                    onClick={() => onDismiss(chatId, suggestion.id)}
                                                    className="text-[10px] text-gray-400 hover:text-gray-600 px-2 py-1"
                                                >
                                                    Dismiss
                                                </button>
                                                <button
                                                    onClick={() => onAccept(chatId, suggestion.id, suggestion.actionType, suggestion.payload)}
                                                    className="text-[10px] bg-gray-900 hover:bg-black text-white px-2.5 py-1.5 rounded font-medium transition-colors"
                                                >
                                                    {suggestion.actionType === ActionType.SCHEDULE_FOLLOWUP ? 'Schedule' : 'Execute'}
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div >
                        </div >
                    ))
                )}
            </div >

            {/* Footer */}
            < div className="p-3 border-t border-gray-100 bg-white text-[10px] text-gray-400 text-center" >
                {filteredSuggestions.length} pending actions total
            </div >
        </div >
    );
};

export default UnifiedActionCenter;
