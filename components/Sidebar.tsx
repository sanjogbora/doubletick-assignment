import React from 'react';
import { Home, MessageSquare, Users, BarChart2, Settings, BookOpen, HelpCircle, Zap } from 'lucide-react';

const Sidebar: React.FC = () => {
  return (
    <div className="w-16 bg-white border-r border-gray-200 flex flex-col items-center py-4 h-full flex-shrink-0 z-20">
      <div className="mb-8">
        <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
           <Zap size={24} />
        </div>
      </div>

      <nav className="flex-1 flex flex-col gap-6 w-full">
        <NavItem icon={<Home size={20} />} label="Home" />
        <NavItem icon={<MessageSquare size={20} />} label="Inbox" active />
        <NavItem icon={<Users size={20} />} label="Contacts" />
        <NavItem icon={<BookOpen size={20} />} label="Broadcast" />
        <NavItem icon={<BarChart2 size={20} />} label="Reports" />
        <NavItem icon={<Settings size={20} />} label="Settings" />
      </nav>

      <div className="mt-auto flex flex-col gap-6 w-full">
        <NavItem icon={<HelpCircle size={20} />} label="Help" />
        <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 text-xs font-bold mx-auto cursor-pointer" title="Profile">
            RP
        </div>
      </div>
    </div>
  );
};

const NavItem: React.FC<{ icon: React.ReactNode, label: string, active?: boolean }> = ({ icon, label, active }) => (
  <div className={`relative group flex items-center justify-center w-full cursor-pointer ${active ? 'text-emerald-600' : 'text-gray-500 hover:text-emerald-600'}`}>
    {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-600 rounded-r-md" />}
    {icon}
    <span className="absolute left-14 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
      {label}
    </span>
  </div>
);

export default Sidebar;