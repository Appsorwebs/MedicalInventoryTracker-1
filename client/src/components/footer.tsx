import React from 'react';
import { ExternalLink } from 'lucide-react';

export default function Footer() {
  const handleFooterClick = () => {
    window.open('https://www.appsorwebs.com', '_blank', 'noopener,noreferrer');
  };

  return (
    <footer
      className="bg-background/50 backdrop-blur-sm border-t py-4 mt-auto cursor-pointer"
      onClick={handleFooterClick}
    >
      <div className="container flex items-center justify-center text-center text-sm text-muted-foreground">
        Developed by Appsorwebs Limited{' '}
        <ExternalLink className="ml-1 h-4 w-4 inline-block" />
      </div>
    </footer>
  );
}