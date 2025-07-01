
import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Mic, MicOff, Search, X } from 'lucide-react';
import { toast } from 'sonner';

interface SearchWithVoiceProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  className?: string;
  isRTL?: boolean;
}

export const SearchWithVoice: React.FC<SearchWithVoiceProps> = ({
  placeholder = 'Search...',
  onSearch,
  className = '',
  isRTL = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Check if speech recognition is supported
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = isRTL ? 'ur-PK' : 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setSearchQuery(transcript);
        onSearch(transcript);
        setIsListening(false);
        
        toast.success(isRTL ? `آپ نے کہا: "${transcript}"` : `You said: "${transcript}"`);
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast.error(isRTL ? 'آواز کی پہچان میں خرابی' : 'Voice recognition failed');
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isRTL, onSearch]);

  const handleVoiceSearch = () => {
    if (!recognition) {
      toast.error(isRTL ? 'آواز کی پہچان دستیاب نہیں' : 'Voice recognition not supported');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
      
      // Auto-stop after 10 seconds
      timeoutRef.current = setTimeout(() => {
        recognition.stop();
        setIsListening(false);
      }, 10000);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    onSearch(value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
  };

  return (
    <div className={`relative flex items-center space-x-2 ${isRTL ? 'space-x-reverse' : ''} ${className}`}>
      <div className="relative flex-1">
        <Search className={`absolute top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground ${isRTL ? 'right-3' : 'left-3'}`} />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={handleInputChange}
          className={`${isRTL ? 'pr-10 pl-10' : 'pl-10 pr-10'} ${isRTL ? 'text-right' : ''}`}
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSearch}
            className={`absolute top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 ${isRTL ? 'left-2' : 'right-2'}`}
            aria-label={isRTL ? 'صاف کریں' : 'Clear search'}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      
      <Button
        variant={isListening ? "destructive" : "outline"}
        size="sm"
        onClick={handleVoiceSearch}
        className={`flex items-center space-x-1 ${isRTL ? 'space-x-reverse' : ''}`}
        aria-label={isRTL ? 'آواز سے تلاش کریں' : 'Voice search'}
      >
        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        <span className="hidden sm:inline">
          {isListening 
            ? (isRTL ? 'سن رہا ہے...' : 'Listening...') 
            : (isRTL ? 'آواز' : 'Voice')
          }
        </span>
      </Button>
    </div>
  );
};
