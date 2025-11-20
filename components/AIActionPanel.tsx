import React, { useState } from 'react';
import { Sparkles, Calendar, Check, Clock, AlertCircle, FileText, ChevronDown, Info, Minus, ThumbsUp, ThumbsDown } from 'lucide-react';
import { AISuggestion, PriorityLevel, ActionType } from '../types';

interface AIActionPanelProps {
    suggestions: AISuggestion[];
    onAccept: (id: string, action: ActionType, payload: any) => void;
    onDismiss: (id: string) => void;
    onEdit: (id: string) => void;
    minimized?: boolean;
    onToggleMinimize?: () => void;
    className?: string;
}

const AIActionPanel: React.FC<AIActionPanelProps> = ({
    suggestions,
    onAccept,
    onDismiss,
    onEdit,
    minimized = false,
    onToggleMinimize,
    className = ""
}) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (suggestions.length === 0) return null;

    // Sort by priority
    const sortedSuggestions = [...suggestions].sort((a, b) => {
        const priorityOrder = { [PriorityLevel.HIGH]: 3, [PriorityLevel.MEDIUM]: 2, [PriorityLevel.LOW]: 1 };
        return priorityOrder[b.priority] - priorityOrder[a.priority];
    });

    if (minimized) {
        return (
            <div
                className={`bg-white shadow-lg border border-indigo-100 rounded-full px-3 py-1.5 flex items-center gap-2 cursor-pointer hover:bg-indigo-50 transition-all animate-in fade-in zoom-in duration-200 ${className}`}
                onClick={onToggleMinimize}
            >
                <div className="relative">
                    <Sparkles size={14} className="text-indigo-600" />
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                </div>
                <span className="text-xs font-bold text-indigo-900">{suggestions.length}</span>
            </div>
        );
    }

    return (
        <div className={`bg-gradient-to-b from-white/95 to-indigo-50/90 backdrop-blur-md border border-indigo-100 shadow-lg rounded-t-xl overflow-hidden transition-all duration-300 ${className}`}>
            {/* Header / Toggle */}
            <div className="flex items-center justify-between p-3 cursor-pointer bg-indigo-50/50 border-b border-indigo-100" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="flex items-center gap-2 text-indigo-900">
                    <div className="p-1.5 bg-white rounded-full shadow-sm border border-indigo-100 relative">
                        <Sparkles size={14} className="text-indigo-600" />
                        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                        </span>
                    </div>
                    <span className="text-sm font-bold">Converso Intelligence</span>
                    <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-medium border border-indigo-200">
                        {suggestions.length} suggested actions
                    </span>
                </div>
                <div className="flex items-center gap-1">
                    <button
                        onClick={(e) => { e.stopPropagation(); onToggleMinimize?.(); }}
                        className="p-1 text-indigo-300 hover:text-indigo-500 hover:bg-indigo-100 rounded transition-colors"
                        title="Minimize to badge"
                    >
                        <Minus size={14} />
                    </button>
                    <button className="text-indigo-400 hover:text-indigo-600 transition-colors">
                        <ChevronDown size={18} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                </div>
            </div>

            {/* Suggestions Grid */}
            {isExpanded && (
                <div className="flex flex-col gap-0 divide-y divide-indigo-50 max-h-[300px] overflow-y-auto">
                    {sortedSuggestions.map((suggestion) => (
                        <SuggestionCard
                            key={suggestion.id}
                            suggestion={suggestion}
                            onAccept={onAccept}
                            onDismiss={onDismiss}
                            onEdit={onEdit}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

const SuggestionCard: React.FC<{
    suggestion: AISuggestion,
    onAccept: any,
    onDismiss: any,
    onEdit: any
}> = ({ suggestion, onAccept, onDismiss, onEdit }) => {

    const [isHovered, setIsHovered] = useState(false);
    const [showReasoning, setShowReasoning] = useState(false);
    const [completedState, setCompletedState] = useState(false);

    const getIcon = (type: ActionType) => {
        switch (type) {
            case ActionType.SCHEDULE_FOLLOWUP: return <Clock size={18} />;
            case ActionType.SEND_TEMPLATE: return <FileText size={18} />;
            case ActionType.ESCALATE: return <AlertCircle size={18} />;
            default: return <Sparkles size={18} />;
        }
    };

    const handleAccept = () => {
        onAccept(suggestion.id, suggestion.actionType, suggestion.payload);
        setCompletedState(true);
    };

    if (completedState) {
        return (
            <div className="p-4 bg-green-50 flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 text-green-800">
                    <CheckCircleIcon className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium">Action completed</span>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs text-green-700">Was this helpful?</span>
                    <div className="flex gap-1">
                        <button className="p-1 hover:bg-green-100 rounded text-green-700 transition-colors"><ThumbsUp size={14} /></button>
                        <button className="p-1 hover:bg-green-100 rounded text-green-700 transition-colors"><ThumbsDown size={14} /></button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div
            className={`p-3 hover:bg-white transition-colors relative group ${suggestion.priority === PriorityLevel.HIGH ? 'bg-red-50/30' : 'bg-white/50'}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* High Priority Marker */}
            {suggestion.priority === PriorityLevel.HIGH && (
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"></div>
            )}

            <div className="flex gap-3 items-start">
                {/* Icon Box */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 shadow-sm border mt-1 ${suggestion.priority === PriorityLevel.HIGH ? 'bg-red-100 border-red-200 text-red-600' : 'bg-white border-indigo-100 text-indigo-600'}`}>
                    {getIcon(suggestion.actionType)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center gap-2">
                            <h4 className="text-sm font-bold text-gray-800 truncate">{suggestion.title}</h4>
                            {suggestion.priority === PriorityLevel.HIGH && (
                                <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded uppercase tracking-wide">High</span>
                            )}
                        </div>
                        {/* Confidence Score */}
                        <div className={`flex items-center gap-1.5 px-1.5 py-0.5 rounded-full border ${suggestion.confidence >= 85 ? 'bg-green-50 border-green-200 text-green-700' :
                            suggestion.confidence >= 70 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                'bg-orange-50 border-orange-200 text-orange-700'
                            }`} title={`AI Confidence: ${suggestion.confidence}%`}>
                            <div className={`w-1.5 h-1.5 rounded-full ${suggestion.confidence >= 85 ? 'bg-green-500' :
                                suggestion.confidence >= 70 ? 'bg-yellow-500' :
                                    'bg-orange-500'
                                }`}></div>
                            <span className="text-[10px] font-bold">{suggestion.confidence}%</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 mt-1">
                        <p className="text-xs text-gray-600 leading-relaxed truncate flex-1">{suggestion.description}</p>

                        {/* Inline Actions */}
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                onClick={() => onDismiss(suggestion.id)}
                                className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 transition-all"
                            >
                                Dismiss
                            </button>
                            <button
                                onClick={handleAccept}
                                className={`text-xs font-medium px-3 py-1 rounded-md shadow-sm flex items-center gap-1 transition-all active:scale-95 ${suggestion.actionType === ActionType.SCHEDULE_FOLLOWUP
                                    ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-200'
                                    : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-200'
                                    }`}
                            >
                                {suggestion.actionType === ActionType.SCHEDULE_FOLLOWUP ? 'Review' : 'Send'}
                            </button>
                        </div>
                    </div>

                    {/* Toggle Reasoning */}
                    <button
                        onClick={() => setShowReasoning(!showReasoning)}
                        className="mt-1 flex items-center gap-1 text-[10px] font-medium text-indigo-400 hover:text-indigo-600 transition-colors"
                    >
                        <Info size={10} />
                        {showReasoning ? 'Hide Logic' : 'Why this suggestion?'}
                    </button>

                    {/* Reasoning Drawer */}
                    {showReasoning && suggestion.reasoning && (
                        <div className="mt-2 p-2 bg-slate-50 rounded-lg border border-slate-100 text-[10px] text-slate-600 space-y-1 animate-in slide-in-from-top-2 duration-200">
                            <div className="flex gap-2 items-start">
                                <span className="font-semibold text-slate-800 w-10 shrink-0">Trigger:</span>
                                <div className="flex-1">
                                    <span className="font-mono bg-yellow-50 text-yellow-800 px-1 py-0.5 rounded border border-yellow-100">{suggestion.reasoning.trigger}</span>
                                </div>
                            </div>
                            <div className="flex gap-2 items-start">
                                <span className="font-semibold text-slate-800 w-10 shrink-0">Intent:</span>
                                <div className="flex-1">
                                    <span className="text-indigo-600 font-bold bg-indigo-50 px-1 py-0.5 rounded">{suggestion.reasoning.intent}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

const CheckCircleIcon = (props: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
)

export default AIActionPanel;
