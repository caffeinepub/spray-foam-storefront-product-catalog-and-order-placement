import { Share2, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ShareButton() {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    // Always use the current deployed URL
    const shareUrl = window.location.origin + window.location.pathname;

    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        const successful = document.execCommand('copy');
        textArea.remove();
        
        if (successful) {
          toast.success('Link copied to clipboard!');
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        } else {
          throw new Error('Copy command failed');
        }
      }
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy link. Please try again.');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="gap-2"
      aria-label="Share this page"
    >
      {copied ? (
        <>
          <Check className="h-4 w-4" />
          <span className="hidden sm:inline">Copied!</span>
        </>
      ) : (
        <>
          <Share2 className="h-4 w-4" />
          <span className="hidden sm:inline">Share</span>
        </>
      )}
    </Button>
  );
}
