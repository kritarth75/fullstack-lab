import { createSelector } from "@reduxjs/toolkit";
import { selectAllPosts } from "./postSlice";


export const selectTotalPosts = createSelector(
  [selectAllPosts],
  (posts) => posts.length
);

export const selectTwitterPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.platform === "twitter")
);

export const selectInstagramPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.platform === "instagram")
);

export const selectLinkedinPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.platform === "linkedin")
);


export const selectShortPosts = createSelector([selectAllPosts], (posts) =>
  posts.filter((p) => p.text.length < 100)
);
