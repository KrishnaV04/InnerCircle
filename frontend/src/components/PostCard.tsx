export type Post = {
  id: string;
  author: string;
  createdAt: string; // ISO or human readable
  content: string;
}

export function PostCard({
  post,
  saved = false,
  onToggleSave,
}: {
  post: Post;
  saved?: boolean;
  onToggleSave?: (id: string) => void;
}) {
  const initial = post.author.charAt(0).toUpperCase();
  return (
    <article className="rounded-xl border border-[#3a3a3a] bg-[#222222] p-5 shadow-sm">
      <header className="mb-3 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#2f2f2f] text-sm font-medium">{initial}</div>
        <div className="flex flex-col flex-1">
          <span className="text-sm font-semibold">{post.author}</span>
          <span className="text-xs text-[#9ca3af]">{post.createdAt}</span>
        </div>
        <button
          type="button"
          onClick={() => onToggleSave?.(post.id)}
          className="rounded-full border border-[#3a3a3a] bg-[#2a2a2a] p-1 hover:bg-[#333]"
          aria-label={saved ? 'Unsave post' : 'Save post'}
        >
          {saved ? (
            /* filled star */
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="#e5e7eb">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.958c.3.922-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.785.57-1.84-.196-1.54-1.118l1.287-3.958a1 1 0 00-.364-1.118L2.05 9.386c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.959z" />
            </svg>
          ) : (
            /* outline star */
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="#e5e7eb" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.959a1 1 0 00.95.69h4.173c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.958c.3.922-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.175 0l-3.376 2.455c-.785.57-1.84-.196-1.54-1.118l1.287-3.958a1 1 0 00-.364-1.118L2.05 9.386c-.783-.57-.38-1.81.588-1.81h4.173a1 1 0 00.95-.69l1.286-3.959z" />
            </svg>
          )}
        </button>
      </header>
      <p className="text-sm leading-relaxed text-[#d1d5db]">{post.content}</p>
    </article>
  );
}

export default PostCard;
