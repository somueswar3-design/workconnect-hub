import { useState } from 'react';
import { Phone, X, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FloatingContact = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {isOpen && (
        <div className="bg-card border shadow-2xl rounded-2xl p-4 min-w-[280px] animate-in slide-in-from-bottom-4 fade-in duration-300">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-foreground">Contact Us</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            <a
              href="tel:9441363687"
              className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Call Us Now</p>
                <p className="font-semibold text-foreground">9441363687</p>
              </div>
            </a>
            <p className="text-xs text-muted-foreground text-center">
              Available 24/7 for IT Support
            </p>
          </div>
        </div>
      )}
      
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-secondary hover:bg-secondary/90"
        aria-label="Contact us"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </Button>
    </div>
  );
};

export default FloatingContact;
