import React from 'react';
import { TrendingUp } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-blue-900 to-blue-800 shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <div className="flex items-center">
          <TrendingUp size={28} className="text-yellow-400 mr-2" />
          <h1 className="text-white text-xl font-bold">TradeTracker</h1>
        </div>
        <div className="ml-auto">
          <div className="text-blue-100 text-sm">
            Trading Performance Analysis
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;