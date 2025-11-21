
import React from 'react';
import { User, Phone, Mail, Tag, Clock, ChevronDown, Edit2, Save, Sparkles, Sparkle } from 'lucide-react';
import { Contact, LeadStage } from '../types';

interface RightPanelProps {
    contact: Contact | null;
}

const RightPanel: React.FC<RightPanelProps> = ({ contact }) => {
    if (!contact) return <div className="w-80 bg-white border-l border-gray-200 hidden lg:block"></div>;

    return (
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col h-full hidden lg:block overflow-y-auto">
            {/* Tabs */}
            <div className="flex border-b border-gray-200">
                <button className="flex-1 py-3 text-sm font-medium text-emerald-600 border-b-2 border-emerald-600">Details</button>
                <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Notes</button>
                <button className="flex-1 py-3 text-sm font-medium text-gray-500 hover:text-gray-700">Activity</button>
            </div>

            <div className="p-6">
                {/* Profile Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="relative mb-3">
                        <img src={contact.avatar} alt={contact.name} className="w-20 h-20 rounded-full object-cover border-2 border-emerald-100 p-1" />
                        <button className="absolute bottom-0 right-0 bg-white shadow-md rounded-full p-1.5 text-gray-600 hover:text-emerald-600 border border-gray-100">
                            <Edit2 size={12} />
                        </button>
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">{contact.name}</h2>
                    <span className="text-sm text-gray-500">Whatsapp Name: {contact.name.split(' ')[0]}</span>
                </div>

                {/* AI Smart Insights */}
                <div className="mb-6 bg-white rounded-xl p-4 border border-indigo-100 relative overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                        <Sparkle size={14} className="text-indigo-600" />
                        <span className="text-xs font-bold text-indigo-800 uppercase tracking-wider">AI Insights</span>
                    </div>

                    <div className="space-y-3 relative z-10">
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Churn Risk</span>
                            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100">Low</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-xs text-gray-600">Sentiment</span>
                            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1">
                                Positive
                            </span>
                        </div>
                        <div className="pt-2 border-t border-gray-100">
                            <span className="text-[10px] text-indigo-400 uppercase font-bold">Next Best Action</span>
                            <p className="text-xs text-indigo-900 font-medium mt-0.5">Send "Green Tick Guide" to nurture interest.</p>
                        </div>
                    </div>
                </div>

                {/* Contact Info */}
                <div className="space-y-6">
                    <InfoGroup icon={<Phone size={16} />} label="Phone Number" value={contact.phone} action />
                    <InfoGroup icon={<Mail size={16} />} label="Email" value={contact.email || 'Add email'} />

                    <div>
                        <div className="flex items-center gap-2 mb-2 text-gray-500">
                            <Tag size={16} />
                            <span className="text-xs font-semibold uppercase">Tags</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {contact.tags.map(tag => (
                                <span key={tag} className="bg-emerald-50 text-emerald-700 text-xs px-2 py-1 rounded border border-emerald-100">
                                    {tag}
                                </span>
                            ))}
                            <button className="text-xs text-gray-400 border border-dashed border-gray-300 px-2 py-1 rounded hover:text-emerald-600 hover:border-emerald-300">
                                + Add
                            </button>
                        </div>
                    </div>

                    {/* Notes Preview */}
                    <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100 relative group">
                        <div className="flex items-center gap-2 mb-2 text-yellow-700">
                            <Clock size={14} />
                            <span className="text-xs font-bold uppercase">Last Note</span>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{contact.notes}"</p>
                        <button className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-600">
                            <Edit2 size={12} />
                        </button>
                    </div>

                    {/* Process Notes Button (For Design Challenge) */}
                    <div className="pt-4 border-t border-gray-100">
                        <button onClick={() => alert('Design Process & Rationale:\n\n1. Problem: Agent Overload.\n2. Solution: In-context AI suggestions.\n3. Trigger: Zoyas message contains "tomorrow 4pm" (Time entity) and "Pricing PDF" (Intent).\n4. Design: Used a gradient card to differentiate AI from standard UI. High priority items (Follow-up) use red accents.')} className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 hover:underline text-center">
                            View Design Process Notes
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};

const InfoGroup = ({ icon, label, value, action }: any) => (
    <div className="flex items-start gap-3">
        <div className="mt-0.5 text-gray-400">{icon}</div>
        <div className="flex-1">
            <p className="text-xs text-gray-500 mb-0.5">{label}</p>
            <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-800">{value}</p>
                {action && (
                    <div className="flex gap-2">
                        <button className="p-1 hover:bg-emerald-50 rounded text-emerald-600">
                            <Phone size={14} />
                        </button>
                        <button className="p-1 hover:bg-emerald-50 rounded text-emerald-600">
                            <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" className="w-3.5 h-3.5" alt="wa" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    </div>
)

export default RightPanel;
