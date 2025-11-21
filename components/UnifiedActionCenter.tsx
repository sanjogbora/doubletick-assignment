import React, { useState } from 'react';
import { X, Check, Clock, AlertCircle, FileText, Filter, Search, ArrowRight, Calendar, Users, Sparkles, CheckCircle, Zap, Target, DollarSign } from 'lucide-react';
import { AISuggestion, PriorityLevel, ActionType, Chat } from '../types';
import { MOCK_PROACTIVE_SUGGESTIONS } from '../constants';
import TemplateReviewModal from './TemplateReviewModal';
import ProactiveActionModal from './ProactiveActionModal';

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
    const [activeTab, setActiveTab] = useState<'ACTIVE' | 'PROACTIVE'>('ACTIVE');
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewingTemplate, setReviewingTemplate] = useState<string>('');
    const [reviewingAction, setReviewingAction] = useState<{
        chatId: string;
        suggestionId: string;
        actionType: ActionType;
        payload: any;
    } | null>(null);
    const [isProactiveModalOpen, setIsProactiveModalOpen] = useState(false);
    const [proactiveAction, setProactiveAction] = useState<{
        suggestion: AISuggestion;
        contactName: string;
        contactAvatar?: string;
        chatId: string;
        suggestionId: string;
    } | null>(null);

    if (!isOpen && !isTabMode) return null;

    // Choose source based on tab
    const sourceSuggestions = activeTab === 'ACTIVE' ? allSuggestions : MOCK_PROACTIVE_SUGGESTIONS;

    const filteredSuggestions = sourceSuggestions.filter(item => {
        if (filter === 'ALL') return true;
        return item.suggestion.priority === (filter === 'HIGH' ? PriorityLevel.HIGH : filter === 'MEDIUM' ? PriorityLevel.MEDIUM : PriorityLevel.LOW);
    });

    // First, identify actions that multiple people need (for batch grouping)
    const actionGroups = filteredSuggestions.reduce((acc, item) => {
        const key = `${item.suggestion.actionType}_${item.suggestion.title}`;
        if (!acc[key]) {
            acc[key] = {
                actionType: item.suggestion.actionType,
                title: item.suggestion.title,
                description: item.suggestion.description,
                payload: item.suggestion.payload,
                contacts: []
            };
        }
        acc[key].contacts.push({
            chatId: item.chatId,
            name: item.contactName,
            avatar: item.contactAvatar,
            suggestionId: item.suggestion.id
        });
        return acc;
    }, {} as Record<string, {
        actionType: ActionType;
        title: string;
        description: string;
        payload: any;
        contacts: Array<{ chatId: string; name: string; avatar?: string; suggestionId: string }>
    }>);

    // Extract grouped actions (actions needed by 2+ contacts)
    type GroupedAction = {
        actionType: ActionType;
        title: string;
        description: string;
        payload: any;
        contacts: Array<{ chatId: string; name: string; avatar?: string; suggestionId: string }>;
    };
    const groupedActions = (Object.values(actionGroups) as GroupedAction[]).filter(group => group.contacts.length > 1);

    // Group suggestions by Chat ID (for individual contact cards)
    const groupedByChat = filteredSuggestions.reduce((acc, item) => {
        // Skip if this suggestion is part of a grouped action
        const isGrouped = groupedActions.some(ga =>
            ga.actionType === item.suggestion.actionType &&
            ga.title === item.suggestion.title
        );

        if (isGrouped) return acc; // Don't duplicate in individual cards

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

    const getIcon = (type: ActionType, title?: string) => {
        // Special icons for Proactive suggestions based on title/context
        if (title?.includes('Inactive Lead')) return <Clock size={16} />;
        if (title?.includes('Frustration')) return <AlertCircle size={16} />;
        if (title?.includes('Priorities')) return <Target size={16} />;
        if (title?.includes('Upsell')) return <DollarSign size={16} />;

        switch (type) {
            case ActionType.SCHEDULE_FOLLOWUP: return <Clock size={16} />;
            case ActionType.SEND_TEMPLATE: return <FileText size={16} />;
            case ActionType.ESCALATE: return <AlertCircle size={16} />;
            default: return <ArrowRight size={16} />;
        }
    };

    const containerClass = isTabMode
        ? "h-full flex flex-col bg-gray-50 border-r border-gray-200"
        : "fixed inset-y-0 left-[64px] w-96 bg-white shadow-2xl z-40 border-r border-gray-200 transform transition-transform duration-300 ease-in-out flex flex-col";

    return (
        <div className={containerClass}>
            {/* Header - Only show in Drawer Mode or show Filters in Tab Mode */}
            <div className="bg-white border-b border-gray-100">
                {!isTabMode && (
                    <div className="p-4 pb-0 flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                            Converso
                        </h2>
                        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                            <X size={20} />
                        </button>
                    </div>
                )}

                {/* Sub-Tabs */}
                <div className="flex px-4 pt-4 border-b border-gray-100">
                    <button
                        onClick={() => setActiveTab('ACTIVE')}
                        className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'ACTIVE' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => setActiveTab('PROACTIVE')}
                        className={`flex-1 pb-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'PROACTIVE' ? 'text-indigo-600 border-indigo-600' : 'text-gray-500 border-transparent hover:text-gray-700'}`}
                    >
                        Proactive
                    </button>
                </div>

                <div className="p-3 flex items-center justify-between gap-2">
                    {/* Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar flex-1">
                        {['ALL', 'HIGH', 'MEDIUM', 'LOW'].map((f) => (
                            <button
                                key={f}
                                onClick={() => setFilter(f as any)}
                                className={`text-[10px] font-bold px-3 py-1.5 rounded-md border transition-colors whitespace-nowrap uppercase tracking-wide ${filter === f
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
                        <button
                            onClick={() => {
                                // Accept all filtered suggestions
                                filteredSuggestions.forEach(item => {
                                    onAccept(item.chatId, item.suggestion.id, item.suggestion.actionType, item.suggestion.payload);
                                });
                            }}
                            className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1.5 whitespace-nowrap bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-md border border-indigo-200 transition-colors"
                        >
                            <CheckCircle size={12} />
                            Accept All
                        </button>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-3 space-y-4">
                {/* Grouped Actions - Multiple contacts need same action */}
                {groupedActions.map((group, idx) => (
                    <div key={idx} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        {/* Group Header */}
                        <div className="bg-indigo-50 px-3 py-2 border-b border-indigo-100 flex items-center gap-2">
                            <div className={`p-1 rounded ${group.actionType === ActionType.SEND_TEMPLATE ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                {getIcon(group.actionType, group.title)}
                            </div>
                            <span className="text-xs font-bold text-gray-700">{group.title}</span>
                            <span className="text-[10px] text-indigo-600 ml-auto bg-indigo-100 px-2 py-0.5 rounded-full font-medium">
                                {group.contacts.length} contacts
                            </span>
                        </div>

                        <div className="p-3">
                            <p className="text-[10px] text-gray-500 mb-3">{group.description}</p>

                            {/* Stacked Avatars + Names */}
                            <div className="flex items-center gap-2 mb-3">
                                <div className="flex -space-x-2">
                                    {group.contacts.slice(0, 3).map((contact, i) => (
                                        <img
                                            key={i}
                                            className="w-7 h-7 rounded-full border-2 border-white object-cover"
                                            src={contact.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(contact.name)}&background=random`}
                                            alt={contact.name}
                                            title={contact.name}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 text-[10px] text-gray-600">
                                    {group.contacts.slice(0, 2).map(c => c.name.split(' ')[0]).join(', ')}
                                    {group.contacts.length > 2 && ` +${group.contacts.length - 2} more`}
                                </div>
                            </div>

                            {/* Batch Action Button */}
                            <button
                                onClick={() => {
                                    if (group.actionType === ActionType.SEND_TEMPLATE) {
                                        // For templates, open review modal for the first contact
                                        const firstContact = group.contacts[0];
                                        setReviewingTemplate(group.payload.templateName || 'Document.pdf');
                                        setReviewingAction({
                                            chatId: firstContact.chatId,
                                            suggestionId: firstContact.suggestionId,
                                            actionType: group.actionType,
                                            payload: group.payload
                                        });
                                        setIsReviewModalOpen(true);
                                    } else {
                                        // Execute for all contacts
                                        group.contacts.forEach(contact => {
                                            onAccept(contact.chatId, contact.suggestionId, group.actionType, group.payload);
                                        });
                                    }
                                }}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-lg shadow-sm transition-colors w-full flex items-center justify-center gap-2"
                            >
                                {getIcon(group.actionType, group.title)}
                                {group.actionType === ActionType.SEND_TEMPLATE ? 'Review & Send' : 'Schedule'} for All ({group.contacts.length})
                            </button>
                        </div>
                    </div>
                ))}

                {Object.values(groupedByChat).length === 0 && groupedActions.length === 0 ? (
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
                                                        {getIcon(suggestion.actionType, suggestion.title)}
                                                    </div>
                                                    <h4 className="text-xs font-bold text-gray-800">{suggestion.title}</h4>
                                                </div>
                                                {suggestion.priority === PriorityLevel.HIGH && (
                                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
                                                )}
                                            </div>

                                            <div className="flex items-center justify-between gap-2 pl-7 mt-1">
                                                <p className="text-[10px] text-gray-500 truncate flex-1" title={suggestion.description}>{suggestion.description}</p>
                                                <div className="flex items-center gap-2 shrink-0">
                                                    <button
                                                        onClick={() => onDismiss(chatId, suggestion.id)}
                                                        className="text-[10px] text-gray-400 hover:text-gray-600 px-2 py-1"
                                                    >
                                                        Dismiss
                                                    </button>
                                                    <button
                                                        onClick={() => {
                                                            if (activeTab === 'PROACTIVE') {
                                                                // Open proactive modal for detailed review
                                                                setProactiveAction({
                                                                    suggestion,
                                                                    contactName,
                                                                    contactAvatar,
                                                                    chatId,
                                                                    suggestionId: suggestion.id
                                                                });
                                                                setIsProactiveModalOpen(true);
                                                            } else if (suggestion.actionType === ActionType.SEND_TEMPLATE) {
                                                                setReviewingTemplate(suggestion.payload.templateName || 'Document.pdf');
                                                                setReviewingAction({
                                                                    chatId,
                                                                    suggestionId: suggestion.id,
                                                                    actionType: suggestion.actionType,
                                                                    payload: suggestion.payload
                                                                });
                                                                setIsReviewModalOpen(true);
                                                            } else {
                                                                onAccept(chatId, suggestion.id, suggestion.actionType, suggestion.payload);
                                                            }
                                                        }}
                                                        className="text-[10px] bg-gray-900 hover:bg-black text-white px-2.5 py-1.5 rounded font-medium transition-colors"
                                                    >
                                                        {activeTab === 'PROACTIVE' ? 'Review' : (suggestion.title.includes('Priorities') ? 'View' : (suggestion.actionType === ActionType.SEND_TEMPLATE ? 'Review' : (suggestion.actionType === ActionType.SCHEDULE_FOLLOWUP ? 'Schedule' : 'Execute')))}
                                                    </button>
                                                </div>
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

            {/* Template Review Modal */}
            <TemplateReviewModal
                isOpen={isReviewModalOpen}
                onClose={() => {
                    setIsReviewModalOpen(false);
                    setReviewingAction(null);
                }}
                templateName={reviewingTemplate}
                onConfirm={(selectedTemplate) => {
                    if (reviewingAction) {
                        const updatedPayload = {
                            ...reviewingAction.payload,
                            templateName: selectedTemplate
                        };
                        onAccept(
                            reviewingAction.chatId,
                            reviewingAction.suggestionId,
                            reviewingAction.actionType,
                            updatedPayload
                        );
                    }
                    setIsReviewModalOpen(false);
                    setReviewingAction(null);
                }}
            />

            {/* Proactive Action Modal */}
            <ProactiveActionModal
                isOpen={isProactiveModalOpen}
                onClose={() => {
                    setIsProactiveModalOpen(false);
                    setProactiveAction(null);
                }}
                suggestion={proactiveAction?.suggestion || null}
                contactName={proactiveAction?.contactName || ''}
                contactAvatar={proactiveAction?.contactAvatar}
                onConfirm={(message, templateName, options) => {
                    if (proactiveAction) {
                        const updatedPayload = {
                            ...proactiveAction.suggestion.payload,
                            message,
                            templateName,
                            ...options
                        };
                        onAccept(
                            proactiveAction.chatId,
                            proactiveAction.suggestionId,
                            proactiveAction.suggestion.actionType,
                            updatedPayload
                        );
                    }
                    setIsProactiveModalOpen(false);
                    setProactiveAction(null);
                }}
            />
        </div >
    );
};

export default UnifiedActionCenter;
