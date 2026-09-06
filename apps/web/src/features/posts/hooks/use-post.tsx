import { useMutation, useQueryClient } from "@tanstack/react-query";
import { create } from 'zustand';
import { useTransition } from "react";
import { Key } from "lucide-react";
import { TPost, TPostPublic, TTrackPublic } from "@pondfm/app-shared";

type PostType = Partial<Omit<TPostPublic, 'track'> & {
  track: Partial<Omit<TTrackPublic, 'stats'>> & {
    stats: Partial<TTrackPublic['stats']>
  }
}>;

type PostState = {
  posts: Record<string, TPostPublic>;
  showRepostModal: boolean;
  getPost: (trackId: string) => TPostPublic | undefined;
  setPosts: (newPosts: TPostPublic[]) => void;
  setIsPending: (state: boolean) => void;
  updatePost: (trackId: string, data: PostType) => void;
  deletePost: (trackId: string) => void;
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
  getPost: (trackId: string) => get().posts[trackId],
  deletePost: (trackId: string) => set(state => {
    const newState = { ...state };
    delete newState.posts[trackId];
    return newState;
  }),
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
    const newData = {
      ...oldData,
      ...newPost,
      track: {
        ...oldData.track,
        ...newPost.track,
        stats: {
          ...oldData.track.stats,
          ...newPost.track?.stats
        }
      }
    }
    return {
      posts: {
        ...state.posts,
        [trackId]: newData
      }
    };
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

  const updatePost = (newState: PostType) => {
    postStore.updatePost(trackId, newState);
    startTransition(() => {
      queryClient.setQueriesData({ queryKey: ['feed'] }, (oldData: any) => {
        if (!oldData) return oldData;
        const newPages = oldData.pages.map(page => {
          return {
            ...page, items: page.items.map(item => {
              return item.track.id === trackId ? {
                ...item,
                ...newState,
                track: {
                  ...item.track,
                  ...newState.track,
                  stats: {
                    ...item.track.stats,
                    ...newState.track?.stats,
                  }
                }
              } : item
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