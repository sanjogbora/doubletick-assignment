import React, { useState } from 'react';
import { Sparkles, Calendar, Check, X, ArrowRight, Clock, AlertCircle, FileText, ChevronDown } from 'lucide-react';
import { AISuggestion, PriorityLevel, ActionType } from '../types';

interface AIActionPanelProps {
  suggestions: AISuggestion[];
  onAccept: (id: string, action: ActionType, payload: any) => void;
  onDismiss: (id: string) => void;
  onEdit: (id: string) => void;
}

const AIActionPanel: React.FC<AIActionPanelProps> = ({ suggestions, onAccept, onDismiss, onEdit }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  if (suggestions.length === 0) return null;

  // Sort by priority
  const sortedSuggestions = [...suggestions].sort((a, b) => {
      const priorityOrder = { [PriorityLevel.HIGH]: 3, [PriorityLevel.MEDIUM]: 2, [PriorityLevel.LOW]: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
  });

  return (
    <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-100 p-4 relative transition-all duration-300">
      {/* Header / Toggle */}
      <div className="flex items-center justify-between mb-3 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="flex items-center gap-2 text-indigo-800">
            <div className="p-1.5 bg-white rounded-full shadow-sm border border-indigo-100">
                 <Sparkles size={14} className="text-indigo-600 animate-pulse" />
            </div>
          <span className="text-sm font-bold">Converso Intelligence</span>
          <span className="bg-indigo-100 text-indigo-700 text-[10px] px-2 py-0.5 rounded-full font-medium">
            {suggestions.length} Suggestions
          </span>
        </div>
        <button className="text-indigo-400 hover:text-indigo-600 transition-colors">
            <ChevronDown size={18} className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Suggestions Grid */}
      {isExpanded && (
          <div className="flex flex-col gap-3">
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

    const getPriorityColor = (p: PriorityLevel) => {
        switch(p) {
            case PriorityLevel.HIGH: return 'text-red-600 bg-red-50 border-red-100';
            case PriorityLevel.MEDIUM: return 'text-orange-600 bg-orange-50 border-orange-100';
            default: return 'text-gray-600 bg-gray-50 border-gray-100';
        }
    };

    const getIcon = (type: ActionType) => {
        switch(type) {
            case ActionType.SCHEDULE_FOLLOWUP: return <Clock size={16} />;
            case ActionType.SEND_TEMPLATE: return <FileText size={16} />;
            case ActionType.ESCALATE: return <AlertCircle size={16} />;
            default: return <Sparkles size={16} />;
        }
    };

    return (
        <div 
            className="bg-white rounded-lg border border-indigo-100 shadow-sm p-3 hover:shadow-md transition-shadow relative group overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Left Stripe for Priority */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${suggestion.priority === PriorityLevel.HIGH ? 'bg-red-400' : 'bg-indigo-400'}`}></div>

            <div className="flex gap-3 ml-2">
                {/* Icon Box */}
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${suggestion.priority === PriorityLevel.HIGH ? 'bg-red-50 text-red-600' : 'bg-indigo-50 text-indigo-600'}`}>
                    {getIcon(suggestion.actionType)}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-gray-800">{suggestion.title}</h4>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-medium text-gray-400 flex items-center gap-1">
                                {suggestion.confidence}% confidence
                                <div className="w-8 h-1 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500" style={{width: `${suggestion.confidence}%`}}></div>
                                </div>
                            </span>
                        </div>
                    </div>
                    
                    <p className="text-xs text-gray-600 mt-0.5">{suggestion.description}</p>
                    
                    {/* Rationale (Explainability) */}
                    <div className="mt-2 flex items-start gap-1.5">
                        <div className="bg-slate-100 px-2 py-1 rounded text-[10px] text-slate-600 italic inline-flex items-center gap-1 border border-slate-200">
                             <Sparkles size={8} />
                             Rationale: {suggestion.rationale}
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions Footer */}
            <div className="mt-3 ml-2 flex items-center justify-between border-t border-gray-50 pt-2">
                 <button 
                    onClick={() => onDismiss(suggestion.id)}
                    className="text-xs text-gray-400 hover:text-gray-600 px-2 py-1 rounded hover:bg-gray-100 flex items-center gap-1 transition-colors"
                >
                    <X size={14} /> Dismiss
                </button>

                <div className="flex items-center gap-2">
                    <button 
                        onClick={() => onEdit(suggestion.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium px-3 py-1.5 rounded hover:bg-indigo-50 transition-colors"
                    >
                        Edit
                    </button>
                    <button 
                        onClick={() => onAccept(suggestion.id, suggestion.actionType, suggestion.payload)}
                        className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-3 py-1.5 rounded-md shadow-sm flex items-center gap-1.5 transition-colors"
                    >
                        <Check size={14} /> 
                        {suggestion.actionType === ActionType.SCHEDULE_FOLLOWUP ? 'Schedule' : 'Send'}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default AIActionPanel;