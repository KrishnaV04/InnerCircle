export function SortMenu() {
  return (
    <div className="relative inline-flex items-center gap-1 rounded-md border border-[#3a3a3a] bg-[#222222] px-3 py-1 text-sm text-[#9ca3af]">
      <span>Recent</span>
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 7L10 12L15 7" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

export default SortMenu;
