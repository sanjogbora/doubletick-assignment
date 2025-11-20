      </div >
  <div className="mt-auto flex flex-col gap-6 w-full">
    <NavItem icon={<HelpCircle size={20} />} label="Help" />
    <div className="w-8 h-8 rounded-full bg-purple-100 border border-purple-300 flex items-center justify-center text-purple-700 text-xs font-bold mx-auto cursor-pointer" title="Profile">
      RP
    </div>
  </div>
    </div >
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