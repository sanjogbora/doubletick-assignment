
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
            name: 'Priya Singh',
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
            name: 'Rahul Sharma',
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
    },
    {
        id: 'chat_4',
        contact: {
            id: 'c4',
            name: 'Amit Kumar',
            phone: '+91 77665 55443',
            leadStage: LeadStage.COLD,
            tags: ['Inactive'],
            notes: 'No response for 2 weeks',
            lastActive: '2 weeks ago',
            source: 'Website',
            avatar: 'https://i.pravatar.cc/150?u=amit'
        },
        pinned: false,
        unreadCount: 0,
        messages: [
            {
                id: 'm41',
                sender: MessageSender.USER,
                content: 'Hi Amit, just checking in.',
                timestamp: '2 weeks ago',
                type: MessageType.TEXT
            }
        ]
    },
    {
        id: 'chat_5',
        contact: {
            id: 'c5',
            name: 'Sneha Gupta',
            phone: '+91 66554 44332',
            leadStage: LeadStage.WARM,
            tags: ['Support'],
            notes: 'Issue with integration',
            lastActive: '5m ago',
            source: 'Support Ticket',
            avatar: 'https://i.pravatar.cc/150?u=sneha'
        },
        pinned: false,
        unreadCount: 1,
        messages: [
            {
                id: 'm51',
                sender: MessageSender.CONTACT,
                content: 'My Shopify integration is not syncing orders.',
                timestamp: '5m ago',
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
    ],
    'chat_2': [
        {
            id: 'sugg_3',
            actionType: ActionType.SEND_TEMPLATE,
            title: 'Send Product Catalog',
            description: 'Share latest catalog for new lead',
            reasoning: {
                trigger: 'New Lead Source: Facebook Ad',
                intent: 'Initial Engagement',
                entities: ['Source: FB Ad']
            },
            confidence: 88,
            priority: PriorityLevel.MEDIUM,
            payload: { templateName: 'Product_Catalog_2024.pdf' }
        }
    ],
    'chat_3': [
        {
            id: 'sugg_4',
            actionType: ActionType.SEND_TEMPLATE,
            title: 'Send Product Catalog',
            description: 'Share latest catalog for new lead',
            reasoning: {
                trigger: 'Post-Demo (24h)',
                intent: 'Nurture',
                entities: ['Event: Demo']
            },
            confidence: 90,
            priority: PriorityLevel.MEDIUM,
            payload: { templateName: 'Product_Catalog_2024.pdf' }
        }
    ],
    'chat_4': [
        {
            id: 'sugg_5',
            actionType: ActionType.SEND_TEMPLATE,
            title: 'Send Product Catalog',
            description: 'Share latest catalog to re-engage',
            reasoning: {
                trigger: 'Inactive for 14 days',
                intent: 'Re-engagement',
                entities: ['Time: 14 days']
            },
            confidence: 85,
            priority: PriorityLevel.MEDIUM,
            payload: { templateName: 'Product_Catalog_2024.pdf' }
        }
    ],
    'chat_5': [
        {
            id: 'sugg_6',
            actionType: ActionType.ESCALATE,
            title: 'Escalate to Technical Support',
            description: 'Integration issue requires technical assistance',
            reasoning: {
                trigger: '"Shopify integration not syncing"',
                intent: 'Technical Issue',
                entities: ['Topic: Integration']
            },
            confidence: 95,
            priority: PriorityLevel.HIGH,
            payload: { department: 'Technical Support' }
        }
    ]
};

export const MOCK_PROACTIVE_SUGGESTIONS = [
    {
        chatId: 'chat_4', // Amit
        contactName: 'Amit Kumar',
        contactAvatar: 'https://i.pravatar.cc/150?u=amit',
        suggestion: {
            id: 'pro_1',
            actionType: ActionType.SEND_TEMPLATE,
            title: 'Inactive Lead - Re-engage Now',
            description: 'No contact in 14 days. Lead at risk of going cold.',
            reasoning: {
                trigger: 'Last message > 14 days',
                intent: 'Re-engagement',
                entities: ['Time: 14 days']
            },
            confidence: 85,
            priority: PriorityLevel.HIGH,
            payload: { templateName: 'Re_Engagement_Template.pdf' }
        }
    },
    {
        chatId: 'chat_5', // Sneha
        contactName: 'Sneha Gupta',
        contactAvatar: 'https://i.pravatar.cc/150?u=sneha',
        suggestion: {
            id: 'pro_2',
            actionType: ActionType.ESCALATE,
            title: 'Frustration Detected - Escalate',
            description: 'Technical issue + frustration keywords. Prevent churn.',
            reasoning: {
                trigger: 'Frustration keywords detected',
                intent: 'Churn Prevention',
                entities: ['Sentiment: Negative']
            },
            confidence: 95,
            priority: PriorityLevel.HIGH,
            payload: { department: 'Technical Support', reason: 'Frustration detected' }
        }
    },
    {
        chatId: 'dashboard', // Special case
        contactName: 'System',
        contactAvatar: 'https://ui-avatars.com/api/?name=System&background=6366f1&color=fff',
        suggestion: {
            id: 'pro_3',
            actionType: ActionType.SCHEDULE_FOLLOWUP, // Using Schedule as placeholder for "View"
            title: 'Your Top 3 Priorities Today',
            description: 'Focus on highest-value tasks first',
            reasoning: {
                trigger: 'Daily Login',
                intent: 'Productivity',
                entities: ['Urgency: High']
            },
            confidence: 100,
            priority: PriorityLevel.MEDIUM,
            payload: { view: 'priority_dashboard' }
        }
    },
    {
        chatId: 'chat_3', // Priya
        contactName: 'Rahul Sharma',
        contactAvatar: 'https://i.pravatar.cc/150?u=priya',
        suggestion: {
            id: 'pro_4',
            actionType: ActionType.SEND_TEMPLATE,
            title: 'Perfect Timing - Post-Demo Upsell',
            description: 'Demo completed 24h ago. Conversion window active.',
            reasoning: {
                trigger: 'Demo + 24h',
                intent: 'Upsell',
                entities: ['Event: Demo']
            },
            confidence: 78,
            priority: PriorityLevel.MEDIUM,
            payload: { templateName: 'Enterprise_Comparison.pdf' }
        }
    }
];
