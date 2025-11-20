import React, { useState } from 'react';
import { X, Check, Clock, AlertCircle, FileText, Filter, Search, ArrowRight, Calendar } from 'lucide-react';
import { AISuggestion, PriorityLevel, ActionType, Chat } from '../types';

interface UnifiedActionCenterProps {
    isOpen: boolean;
    onClose: () => void;
    allSuggestions: { chatId: string; contactName: string; suggestion: AISuggestion }[];
    onAccept: (chatId: string, suggestionId: string, action: ActionType, payload: any) => void;
    onDismiss: (chatId: string, suggestionId: string) => void;
}

const UnifiedActionCenter: React.FC<UnifiedActionCenterProps> = ({
    isOpen,
    onClose,
    allSuggestions,
    onAccept,
    onDismiss
}) => {
    const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MEDIUM' | 'LOW'>('ALL');

    if (!isOpen) return null;

    const filteredSuggestions = allSuggestions.filter(item => {
        if (filter === 'ALL') return true;
        return item.suggestion.priority === (filter === 'HIGH' ? PriorityLevel.HIGH : filter === 'MEDIUM' ? PriorityLevel.MEDIUM : PriorityLevel.LOW);
    });

    const getIcon = (type: ActionType) => {
        switch (type) {
            case ActionType.SCHEDULE_FOLLOWUP: return <Clock size={16} />;
            case ActionType.SEND_TEMPLATE: return <FileText size={16} />;
            case ActionType.ESCALATE: return <AlertCircle size={16} />;
            default: return <ArrowRight size={16} />;
        }
    };

    return (
        <div className="fixed inset-y-0 left-[64px] w-96 bg-white shadow-2xl z-40 border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col">
            {/* Header */}
            <div className="p-5 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                        Action Center
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <X size={20} />
                    </button>
                </div>

                {/* Filters */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f as any)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-full border transition-colors ${filter === f
                                    ? 'bg-indigo-600 text-white border-indigo-600'
                                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                }`}
                        >
                            {f === 'ALL' ? 'All Actions' : f.charAt(0) + f.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {filteredSuggestions.length === 0 ? (
                    <div className="text-center py-10 text-gray-400">
                        <Check size={48} className="mx-auto mb-3 text-gray-300" />
                        <p>All caught up! No pending actions.</p>
                    </div>
                ) : (
                    filteredSuggestions.map(({ chatId, contactName, suggestion }) => (
                        <div key={suggestion.id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`p-1.5 rounded-lg ${suggestion.priority === PriorityLevel.HIGH ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'
                                        }`}>
                                        {getIcon(suggestion.actionType)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-gray-800 leading-tight">{suggestion.title}</h4>
                                        <p className="text-xs text-gray-500">for <span className="font-medium text-indigo-600">{contactName}</span></p>
                                    </div>
                                </div>
                                {suggestion.priority === PriorityLevel.HIGH && (
                                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                )}
                            </div>

                            <p className="text-xs text-gray-600 mb-3 pl-9">{suggestion.description}</p>

                            {/* Actions */}
                            <div className="flex items-center justify-end gap-2 pl-9">
                                <button
                                    onClick={() => onDismiss(chatId, suggestion.id)}
                                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => onAccept(chatId, suggestion.id, suggestion.actionType, suggestion.payload)}
                                    className="text-xs bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5"
                                >
                                    {suggestion.actionType === ActionType.SCHEDULE_FOLLOWUP ? 'Schedule' : 'Execute'}
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-white text-xs text-gray-500 flex justify-between items-center">
                <span>{filteredSuggestions.length} pending actions</span>
                <button className="text-indigo-600 font-medium hover:underline">View Calendar</button>
            </div>
        </div>
    );
};

export default UnifiedActionCenter;
