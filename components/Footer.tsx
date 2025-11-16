import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-base text-stone-400">&copy; 2024 에코상점. All rights reserved.</p>
          <p className="text-sm text-stone-500 mt-2">데모 드롭쉬핑 스토어 컨셉입니다.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;