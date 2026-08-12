import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TPost } from "../../../types/post";
import { create } from 'zustand';
import { useTransition } from "react";
import { Key } from "lucide-react";

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
}));

export function usePost(trackId: string) {
  const queryClient = useQueryClient();
  const postStore = usePostStore();
  const post = postStore.getPost(trackId);
  /*
  const post = queryClient
    .getQueriesData({ queryKey: ['feed'] })
    .flatMap(([key, data]: [string[], any]) => data.pages?.flatMap(page => page.items))?.find(item => item.track.id === trackId);
*/
  const [tansition, startTransition] = useTransition();

  const updatePost = (newState: Partial<TPost>) => {
    console.log('Running update post...');
    postStore.updatePost(trackId, newState);
    startTransition(() => {
      queryClient.setQueriesData({ queryKey: ['feed'] }, (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map(page => {
          return {
            ...page, items: page.items.map(item => {
              return item.track.id === trackId ? { ...item, ...newState } : item
            })
          }
        });

        return {
          ...oldData,
          pages: newPages,
        }
      });
    });
  }
  return {
    post, updatePost,
  }
}