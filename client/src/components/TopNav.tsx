import React from 'react';
import { Route as AboutRoute } from '../routes/about';
import { Route as HomeRoute } from '../routes/index';
import { Link } from '@tanstack/react-router';

const TopNav: React.FC = () => (
  <nav className="w-full h-14 bg-gray-900 text-white flex items-center px-6 py-5 z-10">
    <div className="font-bold text-lg">mtbsplit</div>
    <div className="ml-auto flex gap-4 me-3">
      <Link to={HomeRoute.to}>Home</Link>
      <Link to={AboutRoute.to}>About</Link>
    </div>
  </nav>
);

export default TopNav;
