export enum MessageType {
    TEXT = 'text',
    TEMPLATE = 'template',
    IMAGE = 'image'
}

export enum MessageSender {
    USER = 'user', // The agent
    CONTACT = 'contact', // The customer
    SYSTEM = 'system'
}

export interface Message {
    id: string;
    content: string;
    sender: MessageSender;
    timestamp: string;
    type: MessageType;
    isRead?: boolean;
}

export enum LeadStage {
    NEW = 'New Lead',
    HOT = 'Hot',
    WARM = 'Warm',
    COLD = 'Cold',
    CLOSED_WON = 'Closed Won',
    CLOSED_LOST = 'Closed Lost'
}

export interface Contact {
    id: string;
    name: string;
    phone: string;
    avatar?: string;
    email?: string;
    leadStage: LeadStage;
    tags: string[];
    notes: string;
    lastActive: string;
    source: string;
}

export interface Chat {
    id: string;
    contact: Contact;
    messages: Message[];
    unreadCount: number;
    pinned: boolean;
}

// AI Specific Types
export enum PriorityLevel {
    HIGH = 'High',
    MEDIUM = 'Medium',
    LOW = 'Low'
}

export enum ActionType {
    SCHEDULE_FOLLOWUP = 'schedule_followup',
    SEND_TEMPLATE = 'send_template',
    UPDATE_FIELD = 'update_field',
    ESCALATE = 'escalate'
}

export interface AISuggestion {
    id: string;
    actionType: ActionType;
    title: string;
    description: string;
    rationale: string; // "Why did AI suggest this?"
    confidence: number; // 0 to 100
    priority: PriorityLevel;
    payload?: any; // Data needed to execute (e.g., template ID, date)
    isHidden?: boolean;
}
