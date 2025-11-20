
import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bell, CheckCircle } from 'lucide-react';
import { AISuggestion } from '../types';

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (details: any) => void;
  suggestion: AISuggestion | null;
}

const ScheduleModal: React.FC<ScheduleModalProps> = ({ isOpen, onClose, onConfirm, suggestion }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    if (suggestion && suggestion.payload) {
      // Simulate converting "Tomorrow" to a date string for the input
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const dateStr = tomorrow.toISOString().split('T')[0];
      
      setDate(dateStr);
      setTime(suggestion.payload.time || '09:00');
      setNote(`Follow up: ${suggestion.description}`);
    }
  }, [suggestion, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden scale-100 transition-transform">
        
        {/* Header */}
        <div className="bg-indigo-600 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Schedule Follow-up</h2>
          </div>
          <button onClick={onClose} className="text-indigo-100 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* AI Context Banner */}
        <div className="bg-indigo-50 px-6 py-3 border-b border-indigo-100 flex items-start gap-3">
            <div className="bg-white p-1.5 rounded-full border border-indigo-100 shadow-sm mt-0.5">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
            </div>
            <div>
                <p className="text-xs text-indigo-800 font-medium">AI Suggestion</p>
                <p className="text-sm text-indigo-600">{suggestion?.description}</p>
            </div>
        </div>

        {/* Form */}
        <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Calendar size={12} /> Date
                    </label>
                    <input 
                        type="date" 
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-600 flex items-center gap-1">
                        <Clock size={12} /> Time
                    </label>
                    <input 
                        type="time" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                    />
                </div>
            </div>

            <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-600">Notes</label>
                <textarea 
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all resize-none"
                    placeholder="Add agenda or notes..."
                />
            </div>

            <div className="flex items-center gap-2 text-gray-500 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <Bell size={16} />
                <span className="text-xs">Remind me 15 minutes before</span>
                <div className="ml-auto">
                    <input type="checkbox" defaultChecked className="rounded text-indigo-600 focus:ring-indigo-500" />
                </div>
            </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
            <button 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-200 rounded-lg transition-colors"
            >
                Cancel
            </button>
            <button 
                onClick={() => onConfirm({ date, time, note })}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm flex items-center gap-2 transition-colors"
            >
                <CheckCircle size={16} /> Confirm Schedule
            </button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleModal;
