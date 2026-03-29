import { useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'ai_chat_history';

export function useChat() {
  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [activeChatId, setActiveChatId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const createNewChat = useCallback(() => {
    const newChat = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date().toISOString(),
    };
    setChats(prev => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }, []);

  // Ensure there's always an active chat if chats exist
  useEffect(() => {
    if (chats.length > 0 && !activeChatId) {
      setActiveChatId(chats[0].id);
    } else if (chats.length === 0) {
      createNewChat();
    }
  }, [chats, activeChatId, createNewChat]);

  const activeChat = chats.find(c => c.id === activeChatId) || null;

  const sendMessage = async (content) => {
    if (!content.trim() || !activeChatId) return;

    const userMessage = { role: 'user', content };
    
    // Add user message to state
    setChats(prev => prev.map(chat => {
      if (chat.id === activeChatId) {
        // Update title if it's the first message
        const title = chat.messages.length === 0 ? content.slice(0, 30) + '...' : chat.title;
        return { ...chat, title, messages: [...chat.messages, userMessage] };
      }
      return chat;
    }));

    setIsLoading(true);

    try {
      // Create a temporary placeholder for the AI response
      const aiMessageId = Date.now().toString() + '_ai';
      setChats(prev => prev.map(chat => {
        if (chat.id === activeChatId) {
          return { ...chat, messages: [...chat.messages, { id: aiMessageId, role: 'assistant', content: '' }] };
        }
        return chat;
      }));

      // Get history for context
      const currentChat = chats.find(c => c.id === activeChatId);
      const messagesForApi = currentChat ? [...currentChat.messages, userMessage].map(({role, content}) => ({role, content})) : [userMessage];

      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ messages: messagesForApi }),
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      
      let aiContent = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.replace('data: ', '');
            if (dataStr === '[DONE]') break;
            
            try {
              const data = JSON.parse(dataStr);
              if (data.content) {
                aiContent += data.content;
                // Update the AI message chunk by chunk
                setChats(prev => prev.map(chat => {
                  if (chat.id === activeChatId) {
                    const updatedMessages = [...chat.messages];
                    const targetIndex = updatedMessages.findIndex(m => m.id === aiMessageId);
                    if (targetIndex !== -1) {
                      updatedMessages[targetIndex] = { ...updatedMessages[targetIndex], content: aiContent };
                    }
                    return { ...chat, messages: updatedMessages };
                  }
                  return chat;
                }));
              }
            } catch (e) {
              console.error('Error parsing stream data', e);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Optional: Add error message to chat
    } finally {
      setIsLoading(false);
    }
  };

  const clearChats = () => {
    setChats([]);
    setActiveChatId(null);
  };

  return {
    chats,
    activeChat,
    activeChatId,
    setActiveChatId,
    createNewChat,
    sendMessage,
    isLoading,
    clearChats
  };
}
