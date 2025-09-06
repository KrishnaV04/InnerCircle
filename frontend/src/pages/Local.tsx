import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import { PostCard } from '../components/PostCard';
import type { Post } from '../components/PostCard';
import SortMenu from '../components/SortMenu';

const mock: Post = {
  id: '1',
  author: 'Fiola G.',
  createdAt: '1 day ago',
  content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
};

export default function Local() {
  return (
    <div className="min-h-screen">
      <Header active="local" />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mb-4 flex items-center justify-end">
            <SortMenu />
          </div>
          <div className="mx-auto max-w-2xl">
            <PostCard post={mock} />
          </div>
        </main>
      </div>
    </div>
  );
}
