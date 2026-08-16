import React, { useState } from "react";

const PostCard = React.memo(function PostCard({ post, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(post.content);

  const save = () => {
    onUpdate(post.id, draft);
    setEditing(false);
  };

  return (
    <div className="post-card">
      <div className="post-card-header">
        <span className="platform-tag">{post.platform}</span>
        <button className="icon-btn" onClick={() => onDelete(post.id)}>
          ✕
        </button>
      </div>
      <h3>{post.title}</h3>

      {editing ? (
        <>
          <textarea value={draft} onChange={(e) => setDraft(e.target.value)} rows={3} />
          <div className="row-actions">
            <button className="link-btn" onClick={save}>Save</button>
            <button className="link-btn" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </>
      ) : (
        <>
          <p>{post.content}</p>
          <span className="char-count">{post.content.length} chars</span>
          <button className="link-btn" onClick={() => setEditing(true)}>
            Quick edit
          </button>
        </>
      )}
    </div>
  );
});

export default PostCard;
