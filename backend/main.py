from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from dotenv import load_dotenv
import os, json, time, threading
from pathlib import Path

from openai import OpenAI

DATA_DIR = Path(__file__).parent / 'data'
DATA_DIR.mkdir(parents=True, exist_ok=True)
DB_PATH = DATA_DIR / 'db.json'

def _load_db():
    if DB_PATH.exists():
        with DB_PATH.open('r') as f:
            return json.load(f)
    return {"silent_posts": [], "chats": [], "messages": []}

def _save_db(db):
    tmp = DB_PATH.with_suffix('.tmp')
    with tmp.open('w') as f:
        json.dump(db, f)
    tmp.replace(DB_PATH)

# Load env from repo root
load_dotenv(dotenv_path=Path(__file__).resolve().parents[1] / '.env')
OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
openai_client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None

app = FastAPI(title='InnerCircle Backend')

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

class SilentPostIn(BaseModel):
    author: str
    content: str

class SilentPost(BaseModel):
    id: str
    author: str
    content: str
    created_at: float

class Chat(BaseModel):
    id: str
    user_a: str
    user_b: str
    intro_message: str
    created_at: float

class ChatOut(BaseModel):
    id: str
    other_user: str
    intro_message: str
    created_at: float

# -------- Message models --------
class MessageIn(BaseModel):
    author: str
    content: str


class Message(BaseModel):
    id: str
    chat_id: str
    author: str
    content: str
    created_at: float

@app.post('/api/silent_posts', response_model=SilentPost)
async def create_silent_post(body: SilentPostIn):
    db = _load_db()
    pid = f"sp-{int(time.time()*1000)}"
    post = {"id": pid, "author": body.author.strip(), "content": body.content.strip(), "created_at": time.time()}
    db['silent_posts'].append(post)
    _save_db(db)

    # Match asynchronously to avoid blocking
    threading.Thread(target=_match_post, args=(post,), daemon=True).start()

    return post

@app.get('/api/chats')
def list_chats(user: str) -> List[ChatOut]:
    db = _load_db()
    res: List[ChatOut] = []
    for c in db.get('chats', []):
        if c['user_a'] == user:
            res.append({"id": c['id'], "other_user": c['user_b'], "intro_message": c['intro_message'], "created_at": c['created_at']})
        elif c['user_b'] == user:
            res.append({"id": c['id'], "other_user": c['user_a'], "intro_message": c['intro_message'], "created_at": c['created_at']})
    # sort newest first
    res.sort(key=lambda x: x['created_at'], reverse=True)
    return res

# Internal matching logic using OpenAI
MATCH_SYSTEM = """
You are a helpful assistant that decides whether a new user's private message should be matched with another user's private message to start a direct conversation. Read all existing messages and pick at most ONE best candidate that seems meaningfully compatible with the new message. If none, return matched=false.
Return JSON with keys: matched (boolean), partnerName (string or empty), reason (string), introMessage (string to show both users).
"""

MATCH_USER_TMPL = """New message by {author}:
{content}

Other users' recent messages (most recent first):
{others}

Decide if {author} should be matched with exactly one other user. If none are good candidates, set matched=false.
Return ONLY valid JSON.
"""

def _format_others(posts, exclude_id: str) -> str:
    lines = []
    for p in sorted(posts, key=lambda x: x['created_at'], reverse=True):
        if p['id'] == exclude_id:
            continue
        lines.append(f"- {p['author']}: {p['content'][:500]}")
    return "\n".join(lines) if lines else "(none)"


def _match_post(post: dict):
    db = _load_db()
    others = [p for p in db.get('silent_posts', []) if p['id'] != post['id']]
    if not OPENAI_API_KEY or not openai_client:
        return  # no key; skip matching silently

    prompt_user = MATCH_USER_TMPL.format(author=post['author'], content=post['content'], others=_format_others(others, post['id']))

    try:
        resp = openai_client.chat.completions.create(
            model='gpt-4o-mini',
            messages=[
                {"role": "system", "content": MATCH_SYSTEM},
                {"role": "user", "content": prompt_user},
            ],
            temperature=0.2,
            response_format={"type": "json_object"},
        )
        text = resp.choices[0].message.content
        data = json.loads(text)
    except Exception as e:
        return

    if not isinstance(data, dict) or not data.get('matched'):
        return

    partner = data.get('partnerName') or ''
    if not partner:
        return
    # verify partner exists
    partner_posts = [p for p in others if p['author'] == partner]
    if not partner_posts:
        return

    # create chat if not exists
    db = _load_db()
    # check duplicate
    for c in db.get('chats', []):
        if {c['user_a'], c['user_b']} == {post['author'], partner}:
            return
    chat_id = f"chat-{int(time.time()*1000)}"
    chat = {
        'id': chat_id,
        'user_a': post['author'],
        'user_b': partner,
        'intro_message': data.get('introMessage') or f"We think {post['author']} and {partner} might enjoy chatting.",
        'created_at': time.time(),
    }
    db['chats'].append(chat)

    # seed first system message
    msg_id = f"msg-{int(time.time()*1000)}"
    db.setdefault("messages", []).append(
        {
            "id": msg_id,
            "chat_id": chat_id,
            "author": "system",
            "content": chat["intro_message"],
            "created_at": chat["created_at"],
        }
    )
    _save_db(db)

# -------- Chat message endpoints --------


@app.get('/api/chats/{chat_id}/messages', response_model=List[Message])
def get_chat_messages(chat_id: str):
    db = _load_db()
    # validate chat exists
    if not any(c['id'] == chat_id for c in db.get('chats', [])):
        raise HTTPException(status_code=404, detail='Chat not found')
    msgs = [m for m in db.get('messages', []) if m.get('chat_id') == chat_id]
    msgs.sort(key=lambda x: x['created_at'])
    return msgs


@app.post('/api/chats/{chat_id}/messages', response_model=Message)
def post_chat_message(chat_id: str, body: MessageIn):
    db = _load_db()
    chat = next((c for c in db.get('chats', []) if c['id'] == chat_id), None)
    if not chat:
        raise HTTPException(status_code=404, detail='Chat not found')
    author = (body.author or '').strip()
    if author not in {chat['user_a'], chat['user_b']}:
        raise HTTPException(status_code=403, detail='Author not part of this chat')
    msg = {
        'id': f"msg-{int(time.time()*1000)}",
        'chat_id': chat_id,
        'author': author,
        'content': (body.content or '').strip(),
        'created_at': time.time(),
    }
    if not msg['content']:
        raise HTTPException(status_code=400, detail='Empty content')
    db.setdefault('messages', []).append(msg)
    _save_db(db)
    return msg


@app.get("/api/health")
def health_check():
    return {"status": "ok", "openai_available": openai_client is not None}
