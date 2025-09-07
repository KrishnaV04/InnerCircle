import { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { usePosts } from '../state/PostsContext';
import { Link } from 'react-router-dom';

export default function Private() {
  const { addSilentPost } = usePosts();
  const [showComposer, setShowComposer] = useState(false);
  const [content, setContent] = useState('');
  type Chat = { id: string; other_user: string; intro_message: string; created_at: number };
  const [chats, setChats] = useState<Chat[]>([]);

  const name = sessionStorage.getItem('ic_name') || 'Anonymous';

  const handleCreate = () => setShowComposer(true);
  const handleSubmit = () => {
    if (!content.trim()) return;
    // use tab-scoped name (sessionStorage) so different tabs can post under different names
    addSilentPost(content, name);

    // send to backend
    fetch('/api/silent_posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ author: name, content }),
    }).catch(() => {
      /* ignore network errors for now */
    });

    setContent('');
    setShowComposer(false);
  };

  // poll chats list every 5s
  useEffect(() => {
    let active = true;
    const load = () =>
      fetch('/api/chats?user=' + encodeURIComponent(name))
        .then((r) => r.json())
        .then((data) => {
          if (active) setChats(data);
        })
        .catch(() => {});
    load();
    const id = setInterval(load, 5000);
    return () => {
      active = false;
      clearInterval(id);
    };
  }, [name]);

  return (
    <div className="min-h-screen">
      <Header active="private" />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar mode="private" onMakePost={handleCreate} />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl">
            {showComposer ? (
              <div className="rounded-xl border border-[#3a3a3a] bg-[#222222] p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-medium">Create a silent post</h3>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write privately..."
                  className="mb-3 h-32 w-full rounded-md border border-[#3a3a3a] bg-[#1c1c1c] p-3 text-sm outline-none focus:ring focus:ring-[#3a3a3a]"
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setShowComposer(false)} className="rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-2 text-sm hover:bg-[#333]">Cancel</button>
                  <button onClick={handleSubmit} className="rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-2 text-sm hover:bg-[#333]">Post</button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-[#9ca3af] mb-6">Create a Silent Post to write privately. View them in "My past messages".</div>
                {chats.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium mb-2">Your matches</h3>
                    {chats.map((c) => (
                      <div key={c.id} className="rounded-lg border border-[#3a3a3a] bg-[#222222] p-4">
                        <div className="text-sm font-semibold mb-1">{c.other_user}</div>
                        <div className="text-xs text-[#9ca3af] mb-2">{c.intro_message}</div>
                        <Link
                          to={`/private/chat/${c.id}`}
                          className="inline-block rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-1 text-xs hover:bg-[#333]"
                        >
                          Open chat
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
