
import React from 'react';
import { FileText, Github, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t py-8 mt-12">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <FileText className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">ResumeSync</span>
          </div>
          
          <div className="text-center md:text-left mb-4 md:mb-0">
            <p className="text-sm text-muted-foreground">
              Optimize your resume for job applications. No data stored.
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ResumeSync. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
