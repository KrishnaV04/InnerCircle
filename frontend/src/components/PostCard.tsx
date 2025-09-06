export type Post = {
  id: string;
  author: string;
  createdAt: string; // ISO or human readable
  content: string;
}

export function PostCard({ post }: { post: Post }) {
  const initial = post.author.charAt(0).toUpperCase();
  return (
    <article className="rounded-xl border border-[#3a3a3a] bg-[#222222] p-5 shadow-sm">
      <header className="mb-3 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f2f2f] text-sm font-medium">{initial}</div>
        <div className="flex flex-col">
          <span className="text-sm font-semibold">{post.author}</span>
          <span className="text-xs text-[#9ca3af]">{post.createdAt}</span>
        </div>
      </header>
      <p className="text-sm leading-relaxed text-[#d1d5db]">{post.content}</p>
    </article>
  );
}

export default PostCard;
