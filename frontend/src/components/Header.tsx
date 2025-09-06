import { Link } from 'react-router-dom';

type Props = { active: 'local' | 'private' }

export function Header({ active }: Props) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#3a3a3a] bg-[#222222]/80 backdrop-blur supports-[backdrop-filter]:bg-[#222222]/60">
      <div className="mx-auto flex h-14 max-w-screen-2xl items-center justify-between px-4">
        <div className="text-xl font-semibold tracking-wide">InnerCircle</div>
        <div className="flex items-center gap-2 rounded-full bg-[#2a2a2a] p-1">
          <Link to="/local" className={`px-4 py-1.5 rounded-full text-sm ${active==='local' ? 'bg-[#3a3a3a] text-white' : 'text-[#9ca3af] hover:bg-[#333]'}`}>Local Community</Link>
          <Link to="/private" className={`px-4 py-1.5 rounded-full text-sm ${active==='private' ? 'bg-[#3a3a3a] text-white' : 'text-[#9ca3af] hover:bg-[#333]'}`}>Private Community</Link>
        </div>
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2f2f2f] border border-[#3a3a3a] text-sm">R</div>
      </div>
    </header>
  );
}

export default Header;
