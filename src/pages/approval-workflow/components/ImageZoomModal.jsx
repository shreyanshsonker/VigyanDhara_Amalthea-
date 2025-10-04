import React, { useEffect } from 'react';

import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ImageZoomModal = ({ isOpen, imageUrl, onClose }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e?.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e?.target === e?.currentTarget) {
      onClose();
    }
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = 'receipt.jpg';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      <div className="relative max-w-4xl max-h-full bg-card rounded-lg overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-semibold text-card-foreground">Receipt Preview</h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDownload}
              iconName="Download"
              iconPosition="left"
            >
              Download
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              iconName="X"
            />
          </div>
        </div>

        {/* Image Container */}
        <div className="relative max-h-[80vh] overflow-auto">
          <Image
            src={imageUrl}
            alt="Receipt preview"
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-muted/50">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Press ESC to close</span>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(imageUrl, '_blank')}
                iconName="ExternalLink"
                iconPosition="left"
              >
                Open in New Tab
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageZoomModal;