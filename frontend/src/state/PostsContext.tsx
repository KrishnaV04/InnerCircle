import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type Post = { id: string; author: string; createdAt: string; content: string };

type State = {
  posts: Post[];
  saved: Set<string>;
};

type Ctx = {
  posts: Post[];
  saved: Set<string>;
  addPost: (content: string, author: string) => void;
  toggleSaved: (id: string) => void;
};

const PostsCtx = createContext<Ctx | null>(null);

const LS_KEY = 'ic_posts_v1';
const LS_SAVED = 'ic_saved_v1';

const DEFAULT_POSTS: Post[] = [
  {
    id: 'seed-1',
    author: 'Fiola G.',
    createdAt: '1 day ago',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
  },
];

function loadState(): State {
  try {
    const p = JSON.parse(localStorage.getItem(LS_KEY) || 'null');
    const s = JSON.parse(localStorage.getItem(LS_SAVED) || 'null');
    return {
      posts: Array.isArray(p) && p.length ? p : DEFAULT_POSTS,
      saved: new Set<string>(Array.isArray(s) ? s : []),
    };
  } catch {
    return { posts: DEFAULT_POSTS, saved: new Set() };
  }
}

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(() => loadState().posts);
  const [saved, setSaved] = useState<Set<string>>(() => loadState().saved);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(LS_SAVED, JSON.stringify(Array.from(saved)));
  }, [saved]);

  const addPost = (content: string, author: string) => {
    const id = `${Date.now()}`;
    const createdAt = 'just now';
    setPosts((prev) => [{ id, author, createdAt, content }, ...prev]);
  };

  const toggleSaved = (id: string) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const value = useMemo<Ctx>(() => ({ posts, saved, addPost, toggleSaved }), [posts, saved]);

  return <PostsCtx.Provider value={value}>{children}</PostsCtx.Provider>;
}

export function usePosts() {
  const ctx = useContext(PostsCtx);
  if (!ctx) throw new Error('usePosts must be used within PostsProvider');
  return ctx;
}
