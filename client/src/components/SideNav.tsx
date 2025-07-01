import React from 'react';

const SideNav: React.FC<{ className?: string }> = ({ className }) => (
  <div
    className={`h-full w-48 bg-gray-700 text-gray-200 flex flex-col py-6 px-4 shadow-md ${className}`}
  >
    <nav className="flex flex-col gap-4">
      <a href="#" className="hover:underline">
        Dashboard
      </a>
      <a href="#" className="hover:underline">
        Settings
      </a>
      <a href="#" className="hover:underline">
        Profile
      </a>
    </nav>
  </div>
);

export default SideNav;
