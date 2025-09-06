export function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-[#3a3a3a] p-4 hidden md:block">
      <button className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#3a3a3a] bg-[#222222] px-4 py-2 text-sm hover:bg-[#2a2a2a]">
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#2f2f2f]">+</span>
        Make a Post
      </button>
      <nav className="flex flex-col gap-3 text-sm text-[#9ca3af]">
        <a className="hover:text-[#e5e7eb]" href="#">Public Posts</a>
        <a className="hover:text-[#e5e7eb]" href="#">Saved Posts</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
