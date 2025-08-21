import React from 'react';

const NavBar = ({ items, active, onChange }) => {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-white/90 dark:bg-gray-800/90 border-t border-gray-200 dark:border-gray-700">
      <div className="max-w-3xl mx-auto grid grid-cols-6">
        {items.map(({ key, icon: Icon, label }) => (
          <button
            key={key}
            onClick={() => onChange(key)}
            className={`flex-1 flex flex-col items-center justify-center py-2 ${active === key ? 'text-as-blue-600' : 'text-gray-500'}`}
          >
            <Icon size={20} />
            <span className="text-xs mt-1">{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;


