import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchPosts,
  addPost,
  updatePost,
  deletePost,
  selectAllPosts,
  selectPostAnalytics,
} from "./postsSlice";
import PostCard from "./PostCard";

const PLATFORMS = ["Twitter", "Instagram", "LinkedIn", "Facebook"];

export default function App() {
  const dispatch = useDispatch();
  const posts = useSelector(selectAllPosts);
  const analytics = useSelector(selectPostAnalytics); // memoized via createSelector
  const loading = useSelector((state) => state.posts.loading);
  const error = useSelector((state) => state.posts.error);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState(PLATFORMS[0]);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const handleAdd = useCallback(
    (e) => {
      e.preventDefault();
      if (!title.trim() || !content.trim()) return;
      dispatch(addPost({ title, content, platform }));
      setTitle("");
      setContent("");
    },
    [dispatch, title, content, platform]
  );

  const handleDelete = useCallback((id) => dispatch(deletePost(id)), [dispatch]);

  const handleUpdate = useCallback(
    (id, newContent) => dispatch(updatePost({ id, changes: { content: newContent } })),
    [dispatch]
  );

  const postCount = useMemo(() => posts.length, [posts]);

  return (
    <div className="app">
      <header>
        <h1>Social Post Dashboard</h1>
      </header>

      <section className="analytics">
        <div className="stat">
          <span className="stat-value">{analytics.total}</span>
          <span className="stat-label">Total Posts</span>
        </div>
        <div className="stat">
          <span className="stat-value">{analytics.shortPosts}</span>
          <span className="stat-label">Short Posts (&lt;100 chars)</span>
        </div>
        <div className="stat">
          <span className="stat-value">{postCount - analytics.shortPosts}</span>
          <span className="stat-label">Long Posts</span>
        </div>
      </section>

      <section className="form-section">
        <h2>Add New Post</h2>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={3}
          />
          <div className="form-row">
            <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
              {PLATFORMS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <button type="submit">Add Post</button>
          </div>
        </form>
      </section>

      <section className="list-section">
        <h2>Posts</h2>
        {loading && <p>Loading posts...</p>}
        {error && <p className="error">Error: {error}</p>}
        {!loading && posts.length === 0 && <p>No posts yet. Add one above!</p>}
        <div className="post-list">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onDelete={handleDelete}
              onUpdate={handleUpdate}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
