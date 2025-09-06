import type { FormEvent, ChangeEvent } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim()) return;
    localStorage.setItem('ic_logged_in', '1');
    localStorage.setItem('ic_name', name.trim());
    navigate('/local');
  };

  return (
    <div className="grid min-h-screen place-items-center">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-sm rounded-xl border border-[#3a3a3a] bg-[#222222] p-6 shadow"
      >
        <h1 className="mb-6 text-center text-xl font-semibold">InnerCircle</h1>
        <div className="mb-6">
          <label className="mb-1 block text-sm text-[#9ca3af]">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
            className="w-full rounded-md border border-[#3a3a3a] bg-[#1c1c1c] px-3 py-2 text-sm outline-none focus:ring focus:ring-[#3a3a3a]"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md border border-[#3a3a3a] bg-[#2a2a2a] px-3 py-2 text-sm hover:bg-[#333]"
        >
          Login
        </button>
      </form>
    </div>
  );
}
