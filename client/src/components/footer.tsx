import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-background/50 backdrop-blur-sm border-t py-4 mt-auto">
      <div className="container flex items-center justify-center text-center text-sm text-muted-foreground">
        <p className="flex items-center gap-1">
          Developed by Appsorwebs Limited{' '}
          <a 
            href="https://www.appsorwebs.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            www.appsorwebs.com
            <ExternalLink className="h-3 w-3" />
          </a>
        </p>
      </div>
    </footer>
  );
}