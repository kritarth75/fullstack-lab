import {
  createSlice,
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  nanoid,
} from "@reduxjs/toolkit";

// Normalized structure: { ids: [], entities: {} }
const postsAdapter = createEntityAdapter();

// Simulated API call (mock delay)
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  await new Promise((resolve) => setTimeout(resolve, 700));
  return [
    { id: "1", title: "Launch Day", content: "We just shipped v1! 🎉", platform: "Twitter" },
    { id: "2", title: "Behind the scenes", content: "A quick look at our design process.", platform: "Instagram" },
    { id: "3", title: "Weekly tip", content: "Use keyboard shortcuts to save time.", platform: "LinkedIn" },
  ];
});

const initialState = postsAdapter.getInitialState({
  loading: false,
  error: null,
});

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: {
      reducer: postsAdapter.addOne,
      prepare: ({ title, content, platform }) => ({
        payload: { id: nanoid(), title, content, platform },
      }),
    },
    updatePost: postsAdapter.updateOne,
    deletePost: postsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        postsAdapter.setAll(state, action.payload);
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { addPost, updatePost, deletePost } = postsSlice.actions;
export default postsSlice.reducer;

// Adapter-generated selectors
export const {
  selectAll: selectAllPosts,
  selectById: selectPostById,
  selectIds: selectPostIds,
} = postsAdapter.getSelectors((state) => state.posts);

// Memoized analytics selector (Reselect)
export const selectPostAnalytics = createSelector([selectAllPosts], (posts) => ({
  total: posts.length,
  shortPosts: posts.filter((p) => p.content.length < 100).length,
}));
