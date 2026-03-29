import React, { useState, useEffect } from 'react';
import { Menu, PanelLeft } from 'lucide-react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import InputArea from './components/InputArea';
import { useChat } from './hooks/useChat';

function App() {
  // Start open on desktop, closed on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createNewChat,
    sendMessage,
    isLoading,
    clearChats
  } = useChat();

  return (
    <div className="flex h-screen w-full bg-chat-bg text-gray-100 overflow-hidden font-sans">
      <Sidebar 
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={setActiveChatId}
        onNewChat={createNewChat}
        onClearChats={clearChats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />
      
      <main className="flex-1 flex flex-col relative w-full h-full">
        {/* Desktop floating open button (only visible when sidebar is closed) */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="hidden md:flex absolute top-4 left-4 z-10 p-2 text-gray-400 hover:text-white rounded-md hover:bg-gray-800 transition-colors"
            title="Open sidebar"
          >
            <PanelLeft size={24} />
          </button>
        )}

        {/* Mobile Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/20 bg-chat-bg p-3 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-1 -ml-1 hover:bg-gray-800 rounded-md"
          >
            <Menu size={24} />
          </button>
          <h1 className="flex-1 text-center font-semibold text-sm truncate px-4">
            {activeChat?.title || 'New Chat'}
          </h1>
          <button
            onClick={createNewChat}
            className="p-1 hover:bg-gray-800 rounded-md"
          >
            <svg stroke="currentColor" fill="none" strokeWidth="2" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round" height="20" width="20" xmlns="http://www.w3.org/2000/svg"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          </button>
        </div>

        <ChatArea activeChat={activeChat} isLoading={isLoading} />
        
        <div className="w-full absolute bottom-0">
           <InputArea onSendMessage={sendMessage} isLoading={isLoading} />
        </div>
      </main>
    </div>
  );
}

export default App;
