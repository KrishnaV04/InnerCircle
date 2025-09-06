import Header from '../components/Header';
import Sidebar from '../components/Sidebar';

export default function Private() {
  return (
    <div className="min-h-screen">
      <Header active="private" />
      <div className="mx-auto flex max-w-screen-2xl">
        <Sidebar />
        <main className="flex-1 p-6">
          <div className="mx-auto max-w-2xl text-center text-[#9ca3af]">Private community – coming soon</div>
        </main>
      </div>
    </div>
  );
}
