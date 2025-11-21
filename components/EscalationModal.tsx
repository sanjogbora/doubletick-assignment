import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { AISuggestion } from '../types';

interface EscalationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (note: string) => void;
    suggestion: AISuggestion | null;
}

const EscalationModal: React.FC<EscalationModalProps> = ({ isOpen, onClose, onConfirm, suggestion }) => {
    const [note, setNote] = useState('');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-red-50 px-6 py-4 border-b border-red-100 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-red-700">
                        <AlertCircle size={20} />
                        <h3 className="font-bold">Escalate to Technical Support</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-sm text-gray-600 mb-4">
                        You are about to escalate this conversation to Technical Support. Please provide any additional context or notes for the support team.
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1">
                                Internal Note
                            </label>
                            <textarea
                                value={note}
                                onChange={(e) => setNote(e.target.value)}
                                placeholder="e.g. Customer is facing issue with API integration since yesterday..."
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent min-h-[100px] text-sm resize-none"
                                autoFocus
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(note)}
                        className="px-4 py-2 text-sm font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-all flex items-center gap-2"
                    >
                        Escalate Ticket
                    </button>
                </div>
            </div>
        </div>
    );
};

export default EscalationModal;
