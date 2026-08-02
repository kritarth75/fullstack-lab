import { configureStore } from "@reduxjs/toolkit";
import postReducer, { selectAllPosts } from "./postSlice";

export const store = configureStore({
  reducer: {
    posts: postReducer,
  },
});


store.subscribe(() => {
  const posts = selectAllPosts(store.getState());
  localStorage.setItem("drafts", JSON.stringify(posts));
});
