import { Link } from 'react-router-dom';

export function Sidebar({
  onMakePost,
  mode = 'local',
}: {
  onMakePost?: () => void;
  mode?: 'local' | 'private';
}) {
  const buttonLabel = mode === 'private' ? 'Create Silent Post' : 'Make a Post';
  return (
    <aside className="w-64 shrink-0 border-r border-[#3a3a3a] p-4 hidden md:block">
      <button
        className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#222222] px-4 py-2 text-sm hover:bg-[#2a2a2a]"
        onClick={onMakePost}
      >
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2f2f2f]">+</span>
        {buttonLabel}
      </button>
      <nav className="flex flex-col gap-3 text-sm text-[#9ca3af]">
        {mode === 'local' && (
          <Link className="hover:text-[#e5e7eb]" to="/saved">
            Saved Posts
          </Link>
        )}
        {mode === 'private' && (
          <Link className="hover:text-[#e5e7eb]" to="/private/messages">
            My past messages
          </Link>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
