import { useNavigate } from "react-router-dom";
import { Form } from "../../../components/form";
import { ErrorMessage, SuccessMessage } from "../../../components/helper-message";
import { Input } from "../../../components/input";
import { Modal } from "../../../components/modal";
import { useRef, useState } from "react";
import { useSubmit } from "../../../hooks/use-submit";
import { apiService } from "../../../utils/api-service";
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

type TrackModalProps = {
  track?: TTrack;
}

export function TrackModal({ track }: TrackModalProps) {
  const { toggleState } = useToggleContext();
  const onClose = () => toggleState(false);

  return (
    <Modal
      title='Upload'
      onClose={onClose}>
      <ModalContent track={track} onClose={onClose} />
    </Modal>
  );
}

function GenreSelector({ onChange, defaultSelected }) {
  const [selectedGenre, setSelectedGenre] = useState(defaultSelected);
  const { data: genres, isPending: genresPending } = useMainGenres();
  const onGenreSelected = (genre: string) => {
    setSelectedGenre(genre);
    onChange(genre)
  }
  return (
    <TagList selectedTags={[selectedGenre]} tags={genres || []} onTagSelected={onGenreSelected} />
  );
}

function MoodSelector({ defaultSelected, onChange }) {
  const { items: selectedMoods, toggleItem: toggleMood } = useToggleList<string>({
    initialItems: defaultSelected,
    limit: 3,
    onChanged: (items) => onChange(items)
  });

  const { data: moods, isPending: moodsPending } = useMoods();

  return (
    <TagList tags={moods || []} selectedTags={selectedMoods} onTagSelected={tag => toggleMood(tag)} color="secondary" />
  )
}

function ModalContent({ track, onClose }) {
  const genreRef = useRef<string | null>(track?.genre);
  const moodsRef = useRef<string[]>(track?.moods || []);
  const [progress, setProgress] = useState(0);
  const [progressStatus, setProgressStatus] = useState('uploading');
  const queryClient = useQueryClient();
  const playbackService = usePlaybackContext();
  const authService = useAuthContext();
  const upload = async (data: any, file: File) => {
    const uploadUrlRes = await apiService.requestUploadUrl({
      filename: file.name,
      mimeType: file.type,
      size: file.size,
      title: data.title,
      moods: data.moods,
      genre: data.genre
    });
    if (!uploadUrlRes.ok) {
      return uploadUrlRes;
    }
    const uploadData = await uploadUrlRes.json();
    try {
      await apiService.uploadToUrl({
        file,
        method: 'PUT',
        url: uploadData.uploadUrl,
        onProgress: (percent) => {
          setProgress(percent)
        }
      });
    }
    catch (err) {
      console.log(err.message)
      return { ok: false }
    }

    setProgressStatus('processing');
    return apiService.completeUpload(uploadData.code);
  }

  const { submit, loading, status } = useSubmit({
    fetchFn: async payload => {
      const trackPayload: { title: string; file: File; moods?: string[]; genre: string } = Object.fromEntries(payload) as unknown as any;
      trackPayload.genre = genreRef.current;
      trackPayload.moods = moodsRef.current;
      const { file, ...rest } = trackPayload;

      let res;
      if (!track) {
        res = await upload(rest, file);
      }
      else {
        res = await apiService.updateTrack(track.id, rest);
      }
      if (!res.ok) {
        return { success: false, error: await res.json() };
      }
      queryClient.invalidateQueries({ queryKey: ['feed'] });
      if (file) {
        const currentStorageQuotaConsumed = Number(authService.session.user.subscription.storage_quota_consumed) + file.size;
        await authService.refreshSession({
          user: {
            subscription: {
              storage_quota_consumed: currentStorageQuotaConsumed,
            }
          }
        });
      }

      return { success: true };
    },
    onSuccess: () => {
      setTimeout(() => onClose(), 1000);
    }
  });

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

  console.log(authService.session?.user)
  const { storage_quota, storage_quota_consumed } = authService.session?.user.subscription || {};
  const storageQuotaConsumed = Number(storage_quota_consumed) / Number(storage_quota) * 100;

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

          <LoaderButton type="submit" variant="contained" loading={loading} disabled={loading} fullWidth shape="rounded" paddingEnabled>
            {track ? 'Update' : 'Upload'}
          </LoaderButton>
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
  )
}