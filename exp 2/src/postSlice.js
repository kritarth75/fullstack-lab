import {
  createSlice,
  createEntityAdapter,
  createAsyncThunk,
} from "@reduxjs/toolkit";

function loadSavedDrafts() {
  const saved = localStorage.getItem("drafts");
  return saved ? JSON.parse(saved) : [];
}
/*demo drft*/
export const loadDemoPosts = createAsyncThunk(
  "posts/loadDemoPosts",
  async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!res.ok) {
      throw new Error("Could not fetch demo posts");
    }
    const data = await res.json();
    const platforms = ["twitter", "linkedin", "instagram"];
    return data.slice(0, 5).map((post, index) => ({
      id: post.id,
      platform: platforms[index % platforms.length],
      text: post.title,
    }));
  }
);

const postsAdapter = createEntityAdapter();
const initialState = postsAdapter.setAll(
  postsAdapter.getInitialState({ status: "idle", error: null }),
  loadSavedDrafts()
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    
    addPost(state, action) {
      postsAdapter.addOne(state, action.payload);
    },
    
    updatePost(state, action) {
      const { id, changes } = action.payload;
      postsAdapter.updateOne(state, { id, changes });
    },
    
    deletePost(state, action) {
      postsAdapter.removeOne(state, action.payload);
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loadDemoPosts.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadDemoPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(loadDemoPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addPost, updatePost, deletePost } = postSlice.actions;
export default postSlice.reducer;


export const { selectAll: selectAllPosts } = postsAdapter.getSelectors(
  (state) => state.posts
);
export const selectPostsStatus = (state) => state.posts.status;
export const selectPostsError = (state) => state.posts.error;
