import React from 'react';
import { Plus, MessageSquare, Trash2, Menu, X } from 'lucide-react';

export default function Sidebar({ 
  chats, 
  activeChatId, 
  onSelectChat, 
  onNewChat, 
  onClearChats,
  isOpen,
  onClose,
  onToggle
}) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar Container */}
      <div className={`
        fixed inset-y-0 left-0 z-50 bg-sidebar-bg flex flex-col h-full transform transition-all duration-300 ease-in-out
        md:relative
        ${isOpen ? 'w-64 translate-x-0' : 'w-64 md:w-0 -translate-x-full md:translate-x-0 overflow-hidden'}
      `}>
        {/* We need an inner fixed-width container so content doesn't squish during animation */}
        <div className="w-64 flex flex-col h-full">
          <div className="p-3 flex items-center justify-between">
            <button 
              onClick={onNewChat}
              className="flex-1 flex items-center gap-3 border border-gray-600 rounded-md py-3 px-3 hover:bg-gray-700 transition-colors text-sm"
            >
              <Plus size={16} />
              New chat
            </button>
            {/* Mobile close button */}
            <button 
              className="md:hidden ml-2 p-2 text-gray-400 hover:text-white"
              onClick={onClose}
            >
              <X size={20} />
            </button>
            {/* Desktop hide button */}
            <button 
              className="hidden md:block ml-2 p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-700"
              onClick={onToggle}
              title="Close sidebar"
            >
              <Menu size={20} />
            </button>
          </div>

        <div className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
          {chats.map(chat => (
            <button
              key={chat.id}
              onClick={() => {
                onSelectChat(chat.id);
                if (window.innerWidth < 768) onClose();
              }}
              className={`w-full text-left flex items-center gap-3 py-3 px-3 rounded-md text-sm transition-colors truncate
                ${activeChatId === chat.id ? 'bg-gray-700' : 'hover:bg-gray-800'}`}
            >
              <MessageSquare size={16} className="shrink-0" />
              <span className="truncate flex-1">{chat.title}</span>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-gray-700">
          <button 
            onClick={onClearChats}
            className="flex items-center gap-3 w-full py-3 px-3 rounded-md hover:bg-gray-800 text-sm transition-colors text-red-400 hover:text-red-300"
          >
            <Trash2 size={16} />
            Clear conversations
          </button>
        </div>
        </div> {/* closing inner wrapper */}
      </div> {/* closing outer wrapper */}
    </>
  );
}
