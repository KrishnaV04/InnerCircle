import { useState, useEffect, FormEvent } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

interface Message {
  id: string;
  chat_id: string;
  author: string;
  content: string;
  created_at: number;
}

export default function Chat() {
  const { chatId } = useParams<{ chatId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Get user name from sessionStorage
  const name = sessionStorage.getItem('ic_name') || 'Anonymous';
  
  // Format timestamp to hh:mm
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  // Fetch messages
  useEffect(() => {
    if (!chatId) return;
    
    let active = true;
    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/chats/${chatId}/messages`);
        if (!response.ok) throw new Error('Failed to fetch messages');
        
        const data = await response.json();
        if (active) {
          setMessages(data);
          setLoading(false);
        }
      } catch (err) {
        if (active) {
          setError('Could not load messages');
          setLoading(false);
        }
      }
    };
    
    fetchMessages();
    
    // Poll every 4 seconds
    const interval = setInterval(fetchMessages, 4000);
    
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, [chatId]);
  
  // Handle sending a new message
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !chatId) return;
    
    // Optimistic update
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      chat_id: chatId,
      author: name,
      content: newMessage,
      created_at: Date.now() / 1000
    };
    
    setMessages(prev => [...prev, optimisticMessage]);
    setNewMessage('');
    
    try {
      const response = await fetch(`/api/chats/${chatId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: name, content: newMessage })
      });
      
      if (!response.ok) throw new Error('Failed to send message');
      
      // Replace optimistic message with actual one from server
      const actualMessage = await response.json();
      setMessages(prev => 
        prev.map(msg => msg.id === tempId ? actualMessage : msg)
      );
    } catch (err) {
      // Remove optimistic message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempId));
      setError('Failed to send message');
    }
  };
  
  return (
    <div className="min-h-screen">
      <Header active="private" />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar mode="private" />
        <main className="flex-1 p-6 flex flex-col">
          <div className="mx-auto w-full max-w-2xl flex flex-col flex-1">
            <h2 className="text-lg font-medium mb-4">Chat</h2>
            
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-sm text-[#9ca3af]">Loading messages...</div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-sm text-red-500">{error}</div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-sm text-[#9ca3af]">No messages yet</div>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => {
                  const isSystem = message.author === 'system';
                  const isCurrentUser = message.author === name;
                  
                  return (
                    <div key={message.id} className={`${isSystem ? 'bg-[#2a2a2a]' : 'bg-[#222222]'} rounded-lg border border-[#3a3a3a] p-4`}>
                      <div className="flex justify-between items-center mb-2">
                        <div className={`font-medium text-sm ${isSystem ? 'text-[#9ca3af]' : ''}`}>
                          {isCurrentUser ? 'You' : message.author}
                        </div>
                        <div className="text-xs text-[#9ca3af]">{formatTime(message.created_at)}</div>
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  );
                })}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="mt-auto">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-md border border-[#3a3a3a] bg-[#1c1c1c] p-3 text-sm outline-none focus:ring focus:ring-[#3a3a3a]"
                />
                <button 
                  type="submit" 
                  disabled={!newMessage.trim()}
                  className="rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-3 text-sm hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
