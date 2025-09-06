import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { useMySilentPosts } from '../state/PostsContext';
import { PostCard } from '../components/PostCard';

export default function PrivateMessages() {
  const name = localStorage.getItem('ic_name') || 'Anonymous';
  const posts = useMySilentPosts(name);
  return (
    <div className="min-h-screen">
      <Header active="private" />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar mode="private" />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {posts.length === 0 ? (
              <div className="text-center text-[#9ca3af]">No past messages yet</div>
            ) : (
              posts.map((p) => <PostCard key={p.id} post={p} />)
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
