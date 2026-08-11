import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TPost } from "../../../types/post";
import { create } from 'zustand';

type PostState = {
  posts: Record<string, TPost>;
  showRepostModal: boolean;
  getPost: (trackId: string) => TPost | undefined;
  setPosts: (newPosts: TPost[]) => void;
  setIsPending: (state: boolean) => void;
  updatePost: (trackId: string, data: Partial<TPost>) => void;
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
  getPost: (trackId: string): TPost | undefined => get().posts[trackId],
  setPosts: (posts) => set((state) => {
    return {
      posts: {
        ...state.posts,
        ...Object.fromEntries(
          posts.map(p => ([p.track.id, p]))
        )
      }
    }
  }),
  updatePost: (trackId, newPost) => set((state) => {
    console.log('Updating post', trackId)
    const oldData = state.posts[trackId];
    return {
      posts: {
        ...state.posts,
        [trackId]: {
          ...oldData,
          ...newPost,
        }
      }
    }
  })
}))

export function usePost(trackId: string) {
  const queryClient = useQueryClient();
  const postStore = usePostStore();
  const post = postStore.getPost(trackId);
  const updatePost = (newState: Partial<TPost>) => {
    postStore.updatePost(trackId, newState);
    //Tempoary solution to keep cache in sync.
    queryClient.setQueriesData({ queryKey: ['feed'] }, (oldData: { cursor: string; items: any[] }) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        items: oldData.items.map(item => item.track.id === trackId ? { ...item, ...newState } : item)
      }
    });
  }
  return {
    post, updatePost,
  }
}