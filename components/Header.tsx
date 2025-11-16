import React from 'react';
import { LeafIcon } from './IconComponents';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <a href="#" className="flex-shrink-0 flex items-center gap-2">
              <LeafIcon className="h-8 w-8 text-sky-600" />
              <span className="text-2xl font-bold text-sky-800">에코상점</span>
            </a>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <a href="#" className="text-stone-600 hover:bg-sky-50 hover:text-sky-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">홈</a>
              <a href="#products" className="text-stone-600 hover:bg-sky-50 hover:text-sky-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">제품</a>
              <a href="#ai-tool" className="text-stone-600 hover:bg-sky-50 hover:text-sky-700 px-3 py-2 rounded-md text-sm font-medium transition-colors">AI 도구</a>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;