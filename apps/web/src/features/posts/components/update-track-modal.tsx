import { useRef, useState } from "react";
import { Modal } from "../../../components/modal";
import { useToggleContext } from "../../../providers/toggle-provider";
import { Form } from "../../../components/form";
import { useSubmit } from "../../../hooks/use-submit";
import { apiService } from "../../../utils/api/api-service";
import { createProvider } from "../../../utils/create-provider";
import { TTrack } from "../../../types/track";
import { GenreSelector, MoodSelector } from "./track-modal-selector";
import { Input } from "../../../components/input";
import { LoaderButton } from "../../../components/button";
import { usePostStore } from "../hooks/use-post";
import { useDeleteTrack } from "../hooks/use-delete-track";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useQueryClient } from "@tanstack/react-query";
import { usePlaybackContext } from "../../audio/providers/playback-provider";

const [UpdateTrackProvider, useUpdateTrackContext] = createProvider({
  contextName: 'UpdateTrackContext',
  hook: ({ track }: { track: TTrack }) => {
    return { track }
  },
});

export function UpdateTrackModal({ track }: { track: TTrack }) {
  const { toggleState } = useToggleContext();
  return (
    <Modal title="Update Track" onClose={() => toggleState(false)}>
      <UpdateTrackProvider track={track}>
        <ModalContent />
      </UpdateTrackProvider>
    </Modal>
  );
}

function ModalContent() {
  const authService = useAuthContext();
  const queryClient = useQueryClient();
  const playbackService = usePlaybackContext();
  const { track } = useUpdateTrackContext();
  const genreRef = useRef<string | null>(track?.genre);
  const moodsRef = useRef<string[]>(track?.moods || []);
  const { toggleState: toggleModalVisible } = useToggleContext();
  const postStore = usePostStore();

  const { submit, status, loading } = useSubmit({
    fetchFn: async (payload) => {
      const data = Object.fromEntries(payload);
      const res = await apiService.updateTrack(track.id, data);
      if (res.ok) {
        postStore.updatePost(track.id, data);
      }
      return res;
    },
    onSuccess: () => {
      toggleModalVisible(false);
    }
  });


  const { deleteTrack, status: trackDeleteStatus, loading: trackDeleteLoading } = useDeleteTrack({
    onSuccess: async () => {
      postStore.deletePost(track.id);
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      const newQuotaConsumed = Number(authService.session.user.subscription.storage_quota_consumed) - Number(track.size);
      await authService.refreshSession({
        user: {
          subscription: {
            storage_quota_consumed: newQuotaConsumed,
          }
        }
      })
      toggleModalVisible(false);
    }
  });

  return (
    <Form onSubmit={submit}>
      <Form.Group label='Title'>
        <Input
          required
          type='text'
          name='title'
          placeholder='Type a title for the track...'
          defaultValue={track?.title}
        />
      </Form.Group>
      <Form.Group label='Main Genre'>
        <GenreSelector onChange={genre => genreRef.current = genre} defaultSelected={track?.genre} />
      </Form.Group>
      <Form.Group label='Style (Max 3)'>
        <MoodSelector onChange={moods => moodsRef.current = moods} defaultSelected={track?.moods} />
      </Form.Group>
      <div className="flex w-full gap-2">
        <LoaderButton
          loading={trackDeleteLoading}
          disabled={trackDeleteLoading || trackDeleteStatus === 'success'}
          variant="outlined" color="danger"
          fullWidth shape="rounded"
          paddingEnabled
          type="button"
          onClick={async () => {
            if (playbackService.currentPlayback?.id === track.id) {
              //Stop playback before deleting to prevent errors
              playbackService.stopPlayback();
            }
            await deleteTrack(track.id);
          }}>
          Delete
        </LoaderButton>


        <LoaderButton type="submit" variant="contained" loading={loading} disabled={loading} fullWidth shape="rounded" paddingEnabled>
          Update
        </LoaderButton>
      </div>


    </Form>
  )
}