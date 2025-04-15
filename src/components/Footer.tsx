
import React from 'react';
import { FileText, Github, Twitter, Mail, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="border-t py-8 mt-12 bg-secondary/30">
      <div className="container">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-6 md:mb-0">
            <FileText className="h-5 w-5 text-primary mr-2" />
            <span className="font-medium">ResumeSync</span>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-6 md:mb-0">
            <Link to="/" className="text-sm text-center md:text-left hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/how-it-works" className="text-sm text-center md:text-left hover:text-primary transition-colors">
              How It Works
            </Link>
            <Link to="/about" className="text-sm text-center md:text-left hover:text-primary transition-colors">
              About
            </Link>
            <a href="mailto:contact@resumesync.com" className="text-sm text-center md:text-left hover:text-primary transition-colors flex items-center justify-center md:justify-start gap-1">
              <Mail className="h-4 w-4" />
              Contact
            </a>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="GitHub">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground transition-colors" aria-label="Twitter">
              <Twitter className="h-5 w-5" />
            </a>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-muted text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
          <span>© {new Date().getFullYear()} ResumeSync. Made with</span> 
          <Heart className="h-3 w-3 text-destructive inline" /> 
          <span>for job seekers.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
