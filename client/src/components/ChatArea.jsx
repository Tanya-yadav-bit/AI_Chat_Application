import React, { useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { User, Bot } from 'lucide-react';

export default function ChatArea({ activeChat, isLoading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeChat?.messages, isLoading]);

  if (!activeChat || activeChat.messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
        <h1 className="text-4xl font-bold mb-8 text-white">AI Chat</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl text-sm">
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="font-semibold mb-2">Examples</h2>
            <p className="text-gray-300">"Explain quantum computing in simple terms"</p>
          </div>
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <h2 className="font-semibold mb-2">Capabilities</h2>
            <p className="text-gray-300">Remembers what user said earlier in the conversation</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto pb-32 pt-14 md:pt-4">
      {activeChat.messages.map((message, index) => {
        const isUser = message.role === 'user';
        return (
          <div 
            key={message.id || index} 
            className={`py-8 px-4 ${isUser ? 'bg-chat-bg' : 'bg-message-ai'}`}
          >
            <div className="max-w-3xl mx-auto flex gap-6 text-base md:text-lg">
              <div className="shrink-0 w-8 h-8 rounded-sm shrink-0 flex items-center justify-center">
                {isUser ? (
                  <div className="bg-blue-600 rounded-sm p-1"><User className="text-white" size={20} /></div>
                ) : (
                   <div className="bg-emerald-600 rounded-sm p-1"><Bot className="text-white" size={20} /></div>
                )}
              </div>
              <div className="flex-1 space-y-2 overflow-hidden prose prose-invert max-w-none text-gray-100 placeholder:text-gray-400">
                {isUser ? (
                   <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
                ) : (
                   <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {message.content}
                   </ReactMarkdown>
                )}
              </div>
            </div>
          </div>
        );
      })}
      {isLoading && (
        <div className="py-8 px-4 bg-message-ai">
          <div className="max-w-3xl mx-auto flex gap-6">
            <div className="shrink-0 w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center p-1">
              <Bot className="text-white" size={20} />
            </div>
            <div className="flex-1 flex items-center">
              <span className="flex gap-1">
                <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full" style={{animationDelay: '0ms'}}></span>
                <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full" style={{animationDelay: '150ms'}}></span>
                <span className="animate-bounce inline-block w-2 h-2 bg-gray-400 rounded-full" style={{animationDelay: '300ms'}}></span>
              </span>
            </div>
          </div>
        </div>
      )}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
}
