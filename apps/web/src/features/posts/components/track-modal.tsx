import { useNavigate } from "react-router-dom";
import { Form } from "../../../components/form";
import { ErrorMessage, SuccessMessage } from "../../../components/helper-message";
import { Input } from "../../../components/input";
import { Modal } from "../../../components/modal";
import React, { useCallback, useRef, useState } from "react";
import { useSubmit } from "../../../hooks/use-submit";
import { apiService } from "../../../utils/api/api-service";
import { useMainGenres } from "../hooks/use-main-genres";
import { TagList } from "./tag-list";
import { useMoods } from "../hooks/use-moods";
import { useToggleList } from "../../../hooks/use-toggle-list";
import { TTrack } from "../../../types/track";
import { useQueryClient } from "@tanstack/react-query";
import { Button, LoaderButton } from "../../../components/button";
import { ArrowUp, Trash, X } from "lucide-react";
import { ProgressBar } from "./progress-bar";
import { useDeleteTrack } from "../hooks/use-delete-track";
import { usePostStore } from "../hooks/use-post";
import { usePlaybackContext } from "../../audio/providers/playback-provider";
import { useAuthContext } from "../../auth/providers/auth-provider";
import { useToggleContext } from "../../../providers/toggle-provider";
import { useUploadTrack } from "../hooks/use-upload-track";
import { useUpdateTrack } from "../hooks/use-update-track";
import { GenreSelector } from "./track-modal-selector";
import { MoodSelector } from "./track-modal-selector";

type TrackModalProps = {
  track?: TTrack;
}

export const TrackModal = React.memo(function ({ track }: TrackModalProps) {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);

  return (
    <Modal
      title='Upload'
      onClose={onClose}>
      <ModalContent track={track} onClose={onClose} />
    </Modal>
  );
})

function ModalContent({ track, onClose }) {
  const genreRef = useRef<string | null>(track?.genre);
  const moodsRef = useRef<string[]>(track?.moods || []);
  const queryClient = useQueryClient();
  const playbackService = usePlaybackContext();
  const authService = useAuthContext();
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('uploading');
  const fileSizeRef = useRef<number>(0);

  const { submit: uploadTrack, loading: uploadLoading, status: uploadStatus } = useSubmit({
    fetchFn: async payload => {
      const data = Object.fromEntries(payload) as any;
      data.moods = moodsRef.current;
      data.genre = genreRef.current;
      const { file, ...rest } = data;

      fileSizeRef.current = file.size;
      const res = await apiService.requestUploadUrl({
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        title: rest.title,
        moods: rest.moods,
        genre: rest.genre
      });
      if (!res.ok) {
        return res;
      }
      const uploadSession = await res.json();
      try {
        await apiService.uploadToUrl({
          method: 'PUT',
          url: uploadSession.uploadUrl,
          file,
          onProgress: progress => setProgress(progress)
        });
      } catch (error) {
        return new Response(null, { status: 500 });
      }

      setProgressStatus('processing');
      return await apiService.completeUpload(uploadSession.code);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['feed'] });
      const newStorageConsumed = Number(authService.session?.user.subscription.storage_quota_consumed) + fileSizeRef.current;
      await authService.refreshSession({
        user: {
          subscription: {
            storage_quota_consumed: newStorageConsumed,
          }
        }
      });
      setTimeout(() => onClose(), 1500);
    },
    onError: async res => {
      if (res.status === 409) {
        const err = await res.json();
        return err.error;
      }
    }
  });

  const { submit: updateTrack, loading: updateLoading, status: updateStatus } = useUpdateTrack(track?.id);

  const postStore = usePostStore();
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
      onClose();
    }
  });

  const { storage_quota, storage_quota_consumed } = authService.session?.user.subscription || {};
  const storageQuotaConsumed = Number(storage_quota_consumed) / Number(storage_quota) * 100;
  const loading = track ? updateLoading : uploadLoading;
  const status = track ? updateStatus : uploadStatus;
  const submit = track ? updateTrack : uploadTrack;

  return (
    <div className='flex flex-col w-full gap-8 text-black'>
      <div className='flex flex-col w-full'>
        {
          !track ? <> <h2 className='font-semibold text-lg'>Upload Your Track</h2>
            <p className='text-slate-500'>The platform currently supports only mp3 and wav uploads.</p></> : <>
            <h2 className='font-semibold text-lg'>Edit Your Track</h2>

          </>
        }
      </div>
      {
        !track ? <>
          <div className="flex flex-col w-full">
            <ProgressBar progress={progress} status={progressStatus as any} />
            <div className="flex gap-4">
              <small>Upload progress {progress.toFixed(2) || 0}%</small>
              {progressStatus === 'processing' ? <small>Processing...</small> : null}
            </div>
          </div>

        </> : null
      }
      <div className="flex flex-col w-full">
        <ProgressBar progress={storageQuotaConsumed} status={'uploading'} />
        <small>Quota consumed {storageQuotaConsumed.toFixed(2)}%</small>
      </div>
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
        {
          !track ? <Form.Group label='File'>
            <Input
              required
              type='file'
              name='file'
            />
          </Form.Group> : null
        }

        <Form.Group label='Main Genre'>
          <GenreSelector onChange={genre => genreRef.current = genre} defaultSelected={track?.genre} />
        </Form.Group>
        <Form.Group label='Style (Max 3)'>
          <MoodSelector onChange={moods => moodsRef.current = moods} defaultSelected={track?.moods} />
        </Form.Group>
        <div className="flex w-full gap-2">
          {
            track ? <LoaderButton
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
            </LoaderButton> : <Button variant="outlined" color="primary" fullWidth shape="rounded" paddingEnabled onClick={onClose}>
              Cancel
            </Button>
          }

          <SubmitButton loading={loading} disabled={status === 'success' || loading}>
            {track ? 'Update' : 'Upload'}
          </SubmitButton>
        </div>
        {
          status === 'upload:quota-exceeded' ? <ErrorMessage>You have reached your upload quota. Please upgrade to pro to continue uploading.</ErrorMessage>
            :
            status === 'error'
              ?
              <ErrorMessage>Something went wrong!</ErrorMessage>
              :
              status === 'success'
                ?
                <SuccessMessage>Track upload successfull!</SuccessMessage>
                :
                null
        }
      </Form>
    </div>
  );
}

const SubmitButton = React.memo(function ({ children, loading, disabled }: React.PropsWithChildren & { loading: boolean; disabled: boolean }) {
  return (
    <LoaderButton type="submit" variant="contained" loading={loading} disabled={disabled} fullWidth shape="rounded" paddingEnabled>
      {children}
    </LoaderButton>
  );
})