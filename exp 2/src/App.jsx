
import { useState, useCallback, memo } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./App.css";
import { CHARACTER_LIMITS, PLATFORMS } from "./utils";
import {
  addPost,
  updatePost,
  deletePost,
  loadDemoPosts,
  selectAllPosts,
  selectPostsStatus,
  selectPostsError,
} from "./postSlice";
import {
  selectTotalPosts,
  selectTwitterPosts,
  selectInstagramPosts,
  selectLinkedinPosts,
  selectShortPosts,
} from "./selectors";

const DraftCard = memo(function DraftCard({ draft, onEdit, onDelete }) {
  return (
    <div className="draft-item">
      <p>
        <strong>{draft.platform.toUpperCase()}</strong>
      </p>
      <p>{draft.text}</p>
      <div className="button-row">
        <button onClick={() => onEdit(draft)}>Edit</button>
        <button onClick={() => onDelete(draft.id)}>Delete</button>
      </div>
    </div>
  );
});

function App() {
  const dispatch = useDispatch();

  
  const drafts = useSelector(selectAllPosts);
  const demoStatus = useSelector(selectPostsStatus);
  const demoError = useSelector(selectPostsError);

  const [platform, setPlatform] = useState("twitter");
  const [text, setText] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [logs, setLogs] = useState([]);
  const [publishStatus, setPublishStatus] = useState("idle");
  const [retryCount, setRetryCount] = useState(0);

  function addLog(message) {
    const time = new Date().toLocaleTimeString();
    setLogs((prevLogs) => [`${message} - ${time}`, ...prevLogs].slice(0, 10));
  }

  const limit = CHARACTER_LIMITS[platform];
  const charCount = text.length;
  const isValid = charCount <= limit;
  
  function handleSaveDraft() {
    
    if (text.trim() === "") {
      alert("Please write something before saving!");
      return;
    }

    if (editingId) {

      dispatch(updatePost({ id: editingId, changes: { platform, text } }));
      addLog("Draft Updated");
      setEditingId(null);
    } else {
      dispatch(addPost({ id: Date.now(), platform, text }));
      addLog("Draft Saved");
    }

    
    setText("");
  }

  const handleEdit = useCallback((draft) => {
    setPlatform(draft.platform);
    setText(draft.text);
    setEditingId(draft.id);
  }, []);

  const handleDelete = useCallback(
    (id) => {
      dispatch(deletePost(id));
      addLog("Draft Deleted");
      if (editingId === id) {
        setEditingId(null);
        setText("");
      }
    },
    [dispatch, editingId]
  );

  function handlePublish() {
    if (!isValid || text.trim() === "") {
      alert("Fix errors before publishing!");
      return;
    }

    setPublishStatus("saving"); 

    setTimeout(() => {
     
      const success = Math.random() > 0.4;

      if (success) {
        setPublishStatus("success");
        addLog("Published");
        setRetryCount(0); 
      } else {
        setPublishStatus("failed");
      }
    }, 1500); 
  }

 
  function handleRetry() {
    if (retryCount < 3) {
      setRetryCount(retryCount + 1);
      handlePublish();
    }
  }

  const totalDrafts = drafts.length;
  const twitterCount = drafts.filter((d) => d.platform === "twitter").length;
  const linkedinCount = drafts.filter((d) => d.platform === "linkedin").length;
  const instagramCount = drafts.filter((d) => d.platform === "instagram").length;

  /*analytics*/
  const totalPosts = useSelector(selectTotalPosts);
  const twitterPosts = useSelector(selectTwitterPosts);
  const instagramPosts = useSelector(selectInstagramPosts);
  const linkedinPosts = useSelector(selectLinkedinPosts);
  const shortPosts = useSelector(selectShortPosts);


  return (
    <div className="container">
      <h1> Social Media Post Composer</h1>

      <div className="card">
        <h2>{editingId ? "Edit Draft" : "Create a Post"}</h2>
        <label>Platform:</label>
        <select
          value={platform}
          onChange={(e) => setPlatform(e.target.value)}
        >
          {PLATFORMS.map((p) => (
            <option key={p.value} value={p.value}>
              {p.label}
            </option>
          ))}
        </select>
        <textarea
          rows="5"
          value={text}
          placeholder="What's on your mind?"
          onChange={(e) => setText(e.target.value)}
        />
        <p>
          {charCount} / {limit}
        </p> 
        <p className={isValid ? "success-text" : "error-text"}>
          {isValid ? "Ready to Publish" : "Character limit exceeded"}
        </p>
        <div className="button-row">
          <button onClick={handleSaveDraft}>
            {editingId ? "Update Draft" : "Save Draft"}
          </button>
          <button onClick={handlePublish} disabled={!isValid}>
            Publish
          </button>
        </div>
        {publishStatus === "saving" && <p>⏳ Saving...</p>}
        {publishStatus === "success" && (
          <p className="success-text"> Post Published Successfully</p>
        )}
        {publishStatus === "failed" && (
          <div>
            <p className="error-text"> Save Failed</p>
            {retryCount < 3 ? (
              <button onClick={handleRetry}>
                Retry ({retryCount}/3)
              </button>
            ) : (
              <p className="error-text">Max retries reached</p>
            )}
          </div>
        )}
      </div>
      <div className="card">
        <h2>Statistics</h2>
        <p>Total Drafts: {totalDrafts}</p>
        <p>Twitter Drafts: {twitterCount}</p>
        <p>LinkedIn Drafts: {linkedinCount}</p>
        <p>Instagram Drafts: {instagramCount}</p>
      </div>
      <div className="card">
        <h2>Saved Drafts</h2>
        <div className="button-row">
          <button onClick={() => dispatch(loadDemoPosts())}>
            Load Demo Posts
          </button>
        </div>
        {demoStatus === "loading" && <p>⏳ Loading...</p>}
        {demoStatus === "succeeded" && (
          <p className="success-text">Demo Posts Loaded</p>
        )}
        {demoStatus === "failed" && (
          <p className="error-text">Error: {demoError}</p>
        )}
        {drafts.length === 0 && <p>No drafts yet.</p>}
        {drafts.map((draft) => (
          <DraftCard
            key={draft.id}
            draft={draft}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}
      </div>
      <div className="card">
        <h2>Activity Log</h2>
        {logs.length === 0 && <p>No activity yet.</p>}
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h2>Analytics</h2>
        <p>Total Posts: {totalPosts}</p>
        <p>Twitter Posts: {twitterPosts.length}</p>
        <p>Instagram Posts: {instagramPosts.length}</p>
        <p>LinkedIn Posts: {linkedinPosts.length}</p>
        <p>Short Posts: {shortPosts.length}</p>
      </div>
    </div>
  );
}

export default App;
