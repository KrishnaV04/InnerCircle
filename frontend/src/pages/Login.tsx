import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    localStorage.setItem('ic_logged_in', '1');
    navigate('/local');
  };

  return (
    <div className="grid min-h-screen place-items-center bg-ic-bg">
      <form onSubmit={onSubmit} className="w-full max-w-sm rounded-xl border border-ic-border bg-ic-surface p-6 shadow">
        <h1 className="mb-6 text-center text-xl font-semibold">InnerCircle</h1>
        <div className="mb-4">
          <label className="mb-1 block text-sm text-ic-muted">Email</label>
          <input type="email" required className="w-full rounded-md border border-ic-border bg-[#1c1c1c] px-3 py-2 text-sm outline-none focus:ring focus:ring-[#3a3a3a]" />
        </div>
        <div className="mb-6">
          <label className="mb-1 block text-sm text-ic-muted">Password</label>
          <input type="password" required className="w-full rounded-md border border-ic-border bg-[#1c1c1c] px-3 py-2 text-sm outline-none focus:ring focus:ring-[#3a3a3a]" />
        </div>
        <button type="submit" className="w-full rounded-md border border-ic-border bg-[#2a2a2a] px-3 py-2 text-sm hover:bg-[#333]">Login</button>
      </form>
    </div>
  );
}
