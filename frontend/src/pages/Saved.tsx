import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { usePosts } from '../state/PostsContext';
import { PostCard } from '../components/PostCard';

export default function Saved() {
  const { posts, saved, toggleSaved } = usePosts();
  const savedPosts = posts.filter((p) => saved.has(p.id));
  return (
    <div className="min-h-screen">
      <Header active="local" />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl space-y-4">
            {savedPosts.length === 0 ? (
              <div className="text-center text-[#9ca3af]">No saved posts yet</div>
            ) : (
              savedPosts.map((post) => (
                <PostCard key={post.id} post={post} saved onToggleSave={toggleSaved} />
              ))
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
