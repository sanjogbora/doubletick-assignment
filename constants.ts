
import { Chat, Contact, LeadStage, MessageSender, MessageType, PriorityLevel, ActionType, AISuggestion } from './types';

export const CURRENT_AGENT = {
    name: "Riya Patel",
    role: "Customer Support Agent",
    avatar: "https://i.pravatar.cc/150?u=riya"
};

// Mock Customer: Zoya Sayed (From the prompt)
const CONTACT_ZOYA: Contact = {
    id: 'c1',
    name: 'Zoya Sayed',
    phone: '+91 98765 43210',
    email: 'zoya.s@example.com',
    avatar: 'https://i.pravatar.cc/150?u=zoya',
    leadStage: LeadStage.HOT,
    tags: ['Interested', 'WhatsApp API'],
    notes: 'Customer is asking about pricing for the enterprise plan.',
    lastActive: 'Just now',
    source: 'Website'
};

export const MOCK_CHATS: Chat[] = [
    {
        id: 'chat_1',
        contact: CONTACT_ZOYA,
        pinned: true,
        unreadCount: 1,
        messages: [
            {
                id: 'm1',
                sender: MessageSender.CONTACT,
                content: 'Hi, I was looking at the enterprise plan features.',
                timestamp: '10:30 AM',
                type: MessageType.TEXT
            },
            {
                id: 'm2',
                sender: MessageSender.USER,
                content: 'Hello Zoya! 👋 Thanks for reaching out. What specific features are you interested in?',
                timestamp: '10:32 AM',
                type: MessageType.TEXT
            },
            {
                id: 'm3',
                sender: MessageSender.CONTACT,
                content: 'Mostly the broadcast limits and the chatbot integration.',
                timestamp: '10:35 AM',
                type: MessageType.TEXT
            },
            {
                id: 'm4',
                sender: MessageSender.CONTACT,
                content: 'Can you send me the pricing PDF? Also, I am busy now, can you give me a call tomorrow at 4pm to discuss?',
                timestamp: '10:36 AM',
                type: MessageType.TEXT
            }
        ]
    },
    {
        id: 'chat_2',
        contact: {
            id: 'c2',
            name: 'Rahul Sharma',
            phone: '+91 99887 77665',
            leadStage: LeadStage.NEW,
            tags: ['New Lead'],
            notes: '',
            lastActive: '1h ago',
            source: 'Facebook Ad',
            avatar: 'https://i.pravatar.cc/150?u=rahul'
        },
        pinned: false,
        unreadCount: 0,
        messages: [
            {
                id: 'm21',
                sender: MessageSender.CONTACT,
                content: 'Is this available?',
                timestamp: '09:00 AM',
                type: MessageType.TEXT
            }
        ]
    },
     {
        id: 'chat_3',
        contact: {
            id: 'c3',
            name: 'Priya Singh',
            phone: '+91 88776 66554',
            leadStage: LeadStage.WARM,
            tags: ['Follow-up'],
            notes: 'Needs demo',
            lastActive: 'Yesterday',
            source: 'Referral',
            avatar: 'https://i.pravatar.cc/150?u=priya'
        },
        pinned: false,
        unreadCount: 2,
        messages: [
             {
                id: 'm31',
                sender: MessageSender.CONTACT,
                content: 'Thanks for the demo.',
                timestamp: 'Yesterday',
                type: MessageType.TEXT
            }
        ]
    }
];

// Enhanced Mock Data with Reasoning
export const MOCK_AI_SUGGESTIONS: Record<string, AISuggestion[]> = {
    'chat_1': [
        {
            id: 'sugg_1',
            actionType: ActionType.SCHEDULE_FOLLOWUP,
            title: 'Schedule Call',
            description: 'Call Zoya tomorrow at 4:00 PM',
            reasoning: {
                trigger: '"call tomorrow at 4pm"',
                intent: 'Request Call',
                entities: ['Time: Tomorrow 16:00', 'Action: Call']
            },
            confidence: 98,
            priority: PriorityLevel.HIGH,
            payload: { date: 'Tomorrow', time: '16:00' }
        },
        {
            id: 'sugg_2',
            actionType: ActionType.SEND_TEMPLATE,
            title: 'Send Pricing PDF',
            description: 'Share Enterprise Pricing Brochure',
            reasoning: {
                 trigger: '"send pricing PDF"',
                 intent: 'Request Document',
                 entities: ['Document: Pricing PDF']
            },
            confidence: 92,
            priority: PriorityLevel.MEDIUM,
            payload: { templateName: 'Enterprise_Pricing_v2.pdf' }
        }
    ]
};
