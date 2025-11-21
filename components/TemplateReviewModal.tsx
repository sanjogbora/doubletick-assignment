import React, { useState, useEffect } from 'react';
import { X, FileText, Upload, Check } from 'lucide-react';

interface TemplateReviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    templateName: string;
    onConfirm: (selectedTemplate: string) => void;
}

const AVAILABLE_TEMPLATES = [
    'Enterprise_Pricing_v2.pdf',
    'Product_Catalog_2024.pdf',
    'Re_Engagement_Template.pdf',
    'Enterprise_Comparison.pdf',
    'Service_Agreement.pdf',
    'Feature_Overview.pdf'
];

const TemplateReviewModal: React.FC<TemplateReviewModalProps> = ({
    isOpen,
    onClose,
    templateName,
    onConfirm
}) => {
    const [selectedTemplate, setSelectedTemplate] = useState(templateName);
    const [uploadedFile, setUploadedFile] = useState<string | null>(null);

    // Update selectedTemplate when templateName prop changes
    useEffect(() => {
        if (templateName) {
            setSelectedTemplate(templateName);
            setUploadedFile(null);
        }
    }, [templateName, isOpen]);

    if (!isOpen) return null;

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && file.type === 'application/pdf') {
            setUploadedFile(file.name);
            setSelectedTemplate(file.name);
        }
    };

    const handleConfirm = () => {
        onConfirm(selectedTemplate);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-indigo-50 to-purple-50">
                    <div>
                        <h3 className="text-base font-bold text-gray-900">Review Template</h3>
                        <p className="text-xs text-gray-500 mt-0.5">Confirm or change the document to send</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6">
                    {/* Current Selection */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                            Selected Document
                        </label>
                        <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 flex items-center gap-3">
                            <div className="w-10 h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 border border-red-200">
                                <FileText className="text-red-600" size={22} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="font-semibold text-sm text-gray-900 truncate">{selectedTemplate}</p>
                                <p className="text-xs text-gray-500">PDF Document • 2.4 MB</p>
                            </div>
                            <Check className="text-indigo-600 flex-shrink-0" size={18} />
                        </div>
                    </div>

                    {/* Available Templates */}
                    <div className="mb-6">
                        <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                            Or Choose Different Template
                        </label>
                        <div className="space-y-2 max-h-64 overflow-y-auto">
                            {AVAILABLE_TEMPLATES.map((template) => (
                                <button
                                    key={template}
                                    onClick={() => {
                                        setSelectedTemplate(template);
                                        setUploadedFile(null);
                                    }}
                                    className={`w-full text-left p-2.5 rounded-lg border-2 transition-all flex items-center gap-3 ${selectedTemplate === template
                                            ? 'border-indigo-500 bg-indigo-50'
                                            : 'border-gray-200 hover:border-gray-300 bg-white'
                                        }`}
                                >
                                    <div className={`w-7 h-9 rounded flex items-center justify-center flex-shrink-0 ${selectedTemplate === template
                                            ? 'bg-red-100 border border-red-200'
                                            : 'bg-gray-100 border border-gray-200'
                                        }`}>
                                        <FileText className={selectedTemplate === template ? 'text-red-600' : 'text-gray-500'} size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-medium truncate ${selectedTemplate === template ? 'text-indigo-900' : 'text-gray-700'
                                            }`}>
                                            {template}
                                        </p>
                                        <p className="text-xs text-gray-500">PDF • 2.4 MB</p>
                                    </div>
                                    {selectedTemplate === template && (
                                        <Check className="text-indigo-600 flex-shrink-0" size={16} />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Upload New */}
                    <div>
                        <label className="text-xs font-semibold text-gray-700 mb-2 block uppercase tracking-wide">
                            Or Upload New Document
                        </label>
                        <label className="block">
                            <input
                                type="file"
                                accept=".pdf"
                                onChange={handleFileUpload}
                                className="hidden"
                            />
                            <div className="border-2 border-dashed border-gray-300 rounded-xl p-5 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-all">
                                <Upload className="mx-auto text-gray-400 mb-2" size={28} />
                                <p className="text-sm font-medium text-gray-700">Click to upload PDF</p>
                                <p className="text-xs text-gray-500 mt-1">Maximum file size: 10 MB</p>
                                {uploadedFile && (
                                    <div className="mt-3 inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-medium">
                                        <Check size={14} />
                                        Uploaded: {uploadedFile}
                                    </div>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex gap-3 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg font-semibold text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                    >
                        Confirm & Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TemplateReviewModal;
