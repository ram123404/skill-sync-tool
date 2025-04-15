
import React from 'react';
import { FileText } from 'lucide-react';

const Header = () => {
  return (
    <header className="w-full py-6">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold tracking-tight">ResumeSync</h1>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            How It Works
          </a>
          <a href="#" className="text-sm font-medium hover:text-primary transition-colors">
            About
          </a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
