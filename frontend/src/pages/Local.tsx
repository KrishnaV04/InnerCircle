import { useState } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { PostCard } from '../components/PostCard';
import SortMenu from '../components/SortMenu';
import { usePosts } from '../state/PostsContext';

export default function Local() {
  const { posts, saved, addPost, toggleSaved } = usePosts();
  const [showComposer, setShowComposer] = useState(false);
  const [content, setContent] = useState('');

  const handleMakePost = () => {
    setShowComposer(true);
  };

  const handleSubmitPost = () => {
    if (!content.trim()) return;
    
    const name = localStorage.getItem('ic_name') || 'Anonymous';
    addPost(content, name);
    setContent('');
    setShowComposer(false);
  };

  return (
    <div className="min-h-screen">
      <Header active="local" />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar onMakePost={handleMakePost} mode="local" />
        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-between">
            <div></div>
            <SortMenu />
          </div>
          
          <div className="mx-auto max-w-2xl">
            {showComposer && (
              <div className="mb-6 rounded-xl border border-[#3a3a3a] bg-[#222222] p-5 shadow-sm">
                <h3 className="mb-3 text-sm font-medium">Create a post</h3>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="What's on your mind?"
                  className="mb-3 h-32 w-full rounded-md border border-[#3a3a3a] bg-[#1c1c1c] p-3 text-sm outline-none focus:ring focus:ring-[#3a3a3a]"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setShowComposer(false)}
                    className="rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-2 text-sm hover:bg-[#333]"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitPost}
                    className="rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-4 py-2 text-sm hover:bg-[#333]"
                  >
                    Post
                  </button>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  saved={saved.has(post.id)}
                  onToggleSave={toggleSaved}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
