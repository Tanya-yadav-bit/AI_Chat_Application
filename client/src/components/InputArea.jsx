import React, { useState, useRef, useEffect } from 'react';
import { SendIcon } from 'lucide-react';

export default function InputArea({ onSendMessage, isLoading }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  return (
    <div className="absolute bottom-0 left-0 w-full border-t md:border-t-0 dark:border-white/20 md:border-transparent md:dark:border-transparent bg-chat-bg md:!bg-transparent dark:md:bg-vert-dark-gradient pt-2">
      <form 
        onSubmit={handleSubmit}
        className="stretch mx-2 flex flex-row gap-3 last:mb-2 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-3xl"
      >
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="flex flex-col w-full py-[10px] flex-grow md:py-4 md:pl-4 relative border border-black/10 bg-white dark:border-gray-900/50 dark:text-white dark:bg-gray-700 rounded-xl shadow-xs dark:shadow-xs">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              placeholder="Send a message..."
              className="m-0 w-full resize-none border-0 bg-transparent p-0 pr-12 focus:ring-0 focus-visible:ring-0 appearance-none placeholder-gray-400 outline-none pl-3 md:pl-0"
              style={{ maxHeight: '200px', height: '24px', overflowY: 'auto' }}
              rows={1}
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className={`absolute p-1 rounded-md text-white bottom-3 right-3 md:bottom-4 md:right-4 transition-colors disabled:opacity-40
                ${input.trim() && !isLoading ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-gray-500'}`}
            >
              <SendIcon size={16} />
            </button>
          </div>
        </div>
      </form>
      <div className="px-3 pt-2 pb-3 text-center text-xs text-black/50 dark:text-white/50 md:px-4 md:pt-3 md:pb-6">
        <span>AI models can produce inaccurate information. Verify before trusting.</span>
      </div>
    </div>
  );
}
