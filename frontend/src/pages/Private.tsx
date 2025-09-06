import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { usePosts } from '../state/PostsContext';

export default function Private() {
  const { addSilentPost } = usePosts();
  const [showComposer, setShowComposer] = useState(false);
  const [content, setContent] = useState('');

  const handleCreate = () => setShowComposer(true);
  const handleSubmit = () => {
    if (!content.trim()) return;
    const name = localStorage.getItem('ic_name') || 'Anonymous';
    addSilentPost(content, name);
    setContent('');
    setShowComposer(false);
  };

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
              <div className="text-[#9ca3af]">Create a Silent Post to write privately. View them in "My past messages".</div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
