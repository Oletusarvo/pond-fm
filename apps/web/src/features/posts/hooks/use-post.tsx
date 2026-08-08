import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TPost } from "../../../types/post";
import { create } from 'zustand';

type PostState = {
  posts: Record<string, TPost>;
  showRepostModal: boolean;
  getPost: (id: string) => TPost | undefined;
  setPosts: (newPosts: TPost[]) => void;
  setIsPending: (state: boolean) => void;
  updatePost: (id: string, data: Partial<TPost>) => void;
}
export const usePostStore = create<PostState>((set, get) => ({
  posts: {},
  showRepostModal: false,
  toggleRepostModal: (newState: boolean) => set(state => {
    return {
      ...state,
      showRepostModal: newState,
    }
  }),
  setIsPending: (pendingState: boolean) => set((state) => {
    return {
      ...state,
      isPending: pendingState,
    }
  }),
  getPost: (id: string): TPost | undefined => get().posts[id],
  setPosts: (posts) => set((state) => {
    return {
      posts: {
        ...state.posts,
        ...Object.fromEntries(
          posts.map(p => ([p.id, p]))
        )
      }
    }
  }),
  updatePost: (id, newPost) => set((state) => {
    const oldData = state.posts[id];
    return {
      posts: {
        ...state.posts,
        [id]: {
          ...oldData,
          ...newPost,
        }
      }
    }
  })
}))

export function usePost(id: string) {
  const postStore = usePostStore();
  const post = postStore.getPost(id);
  const updatePost = (newState: Partial<TPost>) => {
    postStore.updatePost(id, newState);
  }
  return {
    post, updatePost,
  }
}