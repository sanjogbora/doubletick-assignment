import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Clock, Target, DollarSign, FileText, TrendingUp, Calendar, CheckCircle, Send } from 'lucide-react';
import { AISuggestion, ActionType, PriorityLevel } from '../types';

interface ProactiveActionModalProps {
    isOpen: boolean;
    onClose: () => void;
    suggestion: AISuggestion | null;
    contactName: string;
    contactAvatar?: string;
    onConfirm: (message: string, templateName?: string, options?: any) => void;
}

const AVAILABLE_TEMPLATES = [
    'Re_Engagement_Template.pdf',
    'Enterprise_Comparison.pdf',
    'Product_Catalog_2024.pdf',
    'Enterprise_Pricing_v2.pdf',
    'Service_Agreement.pdf',
    'Feature_Overview.pdf'
];

const ProactiveActionModal: React.FC<ProactiveActionModalProps> = ({
    isOpen,
    onClose,
    suggestion,
    contactName,
    contactAvatar,
    onConfirm
}) => {
    const [message, setMessage] = useState('');
    const [selectedTemplate, setSelectedTemplate] = useState<string>('');
    const [scheduleFollowup, setScheduleFollowup] = useState(false);
    const [markHighPriority, setMarkHighPriority] = useState(false);

    useEffect(() => {
        if (suggestion && isOpen) {
            setMessage(getDefaultMessage(suggestion, contactName));
            setSelectedTemplate(suggestion.payload?.templateName || '');
            setScheduleFollowup(false);
            setMarkHighPriority(suggestion.priority === PriorityLevel.HIGH);
        }
    }, [suggestion, contactName, isOpen]);

    if (!isOpen || !suggestion) return null;

    const getDefaultMessage = (sugg: AISuggestion, name: string): string => {
        const firstName = name.split(' ')[0];

        switch (sugg.title) {
            case 'Inactive Lead - Re-engage Now':
                return `Hi ${firstName},\n\nI wanted to check in - it's been a while since we last spoke. Are you still interested in exploring our enterprise solution?\n\nI'd love to reconnect and see how we can help your business.\n\nBest regards`;

            case 'Frustration Detected - Escalate':
                return `Hi ${firstName},\n\nI sincerely apologize for the technical difficulties you're experiencing. I understand how frustrating this must be.\n\nI'm escalating your case to our senior technical team who will prioritize resolving this issue immediately. You can expect a response within the next hour.\n\nThank you for your patience.`;

            case 'Perfect Timing - Post-Demo Upsell':
                return `Hi ${firstName},\n\nThank you for taking the time for our demo yesterday! I hope it gave you a clear picture of how our platform can transform your operations.\n\nI've attached a detailed comparison of our Enterprise plan features. Given your requirements, I believe this would be the perfect fit.\n\nWould you like to schedule a quick call to discuss pricing and next steps?\n\nLooking forward to hearing from you!`;

            default:
                return `Hi ${firstName},\n\n`;
        }
    };

    const getIcon = () => {
        if (suggestion.title.includes('Inactive')) return <Clock className="text-orange-600" size={24} />;
        if (suggestion.title.includes('Frustration')) return <AlertCircle className="text-red-600" size={24} />;
        if (suggestion.title.includes('Priorities')) return <Target className="text-indigo-600" size={24} />;
        if (suggestion.title.includes('Upsell')) return <DollarSign className="text-yellow-600" size={24} />;
        return <TrendingUp className="text-indigo-600" size={24} />;
    };

    const getContextData = () => {
        switch (suggestion.title) {
            case 'Inactive Lead - Re-engage Now':
                return {
                    lastContact: '14 days ago',
                    engagement: 'Previously High',
                    leadValue: 'Medium',
                    riskFactor: '80% churn rate for 14+ day gaps'
                };
            case 'Frustration Detected - Escalate':
                return {
                    lastContact: '5 minutes ago',
                    sentiment: 'Negative (Frustration detected)',
                    issueType: 'Technical - Integration',
                    urgency: 'High - Immediate action required'
                };
            case 'Perfect Timing - Post-Demo Upsell':
                return {
                    lastContact: '24 hours ago (Demo)',
                    engagement: 'High',
                    conversionWindow: '48 hours (65% conversion rate)',
                    leadValue: 'High'
                };
            default:
                return {};
        }
    };

    const contextData = getContextData();

    const handleSend = () => {
        onConfirm(message, selectedTemplate, {
            scheduleFollowup,
            markHighPriority
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 bg-white">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-200">
                                {getIcon()}
                            </div>
                            <div>
                                <h3 className="text-base font-bold text-gray-900">{suggestion.title}</h3>
                                <p className="text-xs text-gray-600 mt-0.5">Proactive Suggestion for {contactName}</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {/* Why This Matters */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide flex items-center gap-2">
                            <TrendingUp size={14} />
                            Why This Matters
                        </h4>
                        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-800 font-medium">{suggestion.description}</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Trigger:</span> {suggestion.reasoning.trigger}
                                    </p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-600 mt-1.5 flex-shrink-0"></div>
                                    <p className="text-sm text-gray-700">
                                        <span className="font-semibold">Intent:</span> {suggestion.reasoning.intent}
                                    </p>
                                </div>
                                {suggestion.confidence && (
                                    <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-200">
                                        <span className="text-xs font-semibold text-gray-600">AI Confidence:</span>
                                        <div className={`flex items-center gap-1.5 px-2 py-1 rounded-full border ${suggestion.confidence >= 85 ? 'bg-green-50 border-green-200 text-green-700' :
                                                suggestion.confidence >= 70 ? 'bg-yellow-50 border-yellow-200 text-yellow-700' :
                                                    'bg-orange-50 border-orange-200 text-orange-700'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${suggestion.confidence >= 85 ? 'bg-green-500' :
                                                    suggestion.confidence >= 70 ? 'bg-yellow-500' :
                                                        'bg-orange-500'
                                                }`}></div>
                                            <span className="text-xs font-bold">{suggestion.confidence}%</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Data Points */}
                    {Object.keys(contextData).length > 0 && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Context Data
                            </h4>
                            <div className="grid grid-cols-2 gap-3">
                                {Object.entries(contextData).map(([key, value]) => (
                                    <div key={key} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mb-1">
                                            {key.replace(/([A-Z])/g, ' $1').trim()}
                                        </p>
                                        <p className="text-sm text-gray-900 font-medium">{value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* AI-Drafted Message */}
                    {suggestion.title !== 'Your Top 3 Priorities Today' && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                AI-Drafted Message
                            </h4>
                            <div className="relative">
                                <textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full h-40 p-3 border-2 border-gray-200 rounded-xl text-sm text-gray-800 focus:border-indigo-400 focus:outline-none resize-none"
                                    placeholder="Edit your message here..."
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                                    {message.length} characters
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Attach Template */}
                    {suggestion.actionType === ActionType.SEND_TEMPLATE && (
                        <div>
                            <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                                Attach Template (Optional)
                            </h4>
                            <select
                                value={selectedTemplate}
                                onChange={(e) => setSelectedTemplate(e.target.value)}
                                className="w-full p-2.5 border-2 border-gray-200 rounded-lg text-sm text-gray-800 focus:border-indigo-400 focus:outline-none bg-white"
                            >
                                <option value="">No template</option>
                                {AVAILABLE_TEMPLATES.map((template) => (
                                    <option key={template} value={template}>{template}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Additional Options */}
                    <div>
                        <h4 className="text-xs font-bold text-gray-700 mb-2 uppercase tracking-wide">
                            Additional Options
                        </h4>
                        <div className="space-y-2">
                            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={scheduleFollowup}
                                    onChange={(e) => setScheduleFollowup(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">Schedule follow-up reminder</p>
                                    <p className="text-xs text-gray-500">Get reminded in 3 days if no response</p>
                                </div>
                            </label>
                            <label className="flex items-center gap-3 p-3 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={markHighPriority}
                                    onChange={(e) => setMarkHighPriority(e.target.checked)}
                                    className="w-4 h-4 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500"
                                />
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">Mark as high priority</p>
                                    <p className="text-xs text-gray-500">Move to top of your task list</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Dismiss
                    </button>
                    <button
                        onClick={() => {
                            alert('Draft saved!');
                            onClose();
                        }}
                        className="px-4 py-2 border-2 border-indigo-200 bg-indigo-50 text-indigo-700 rounded-lg font-semibold text-sm hover:bg-indigo-100 transition-colors"
                    >
                        Save Draft
                    </button>
                    <button
                        onClick={handleSend}
                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                    >
                        <Send size={16} />
                        {suggestion.title === 'Your Top 3 Priorities Today' ? 'View Dashboard' : 'Send Now'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProactiveActionModal;
