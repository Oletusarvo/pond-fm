import { useRef, useState } from "react";
import { Modal } from "../../../components/modal";
import { useToggleContext } from "../../../providers/toggle-provider";
import { Form } from "../../../components/form";
import { createProvider } from "../../../utils/create-provider";
import { GenreSelector, MoodSelector } from "./track-modal-selector";
import { Input } from "../../../components/input";
import { Button, LoaderButton } from "../../../components/button";
import { useDeleteTrack } from "../hooks/use-delete-track";
import { usePlaybackContext } from "../../audio/providers/playback-provider";
import { useUpdateTrack } from "../hooks/use-update-track";
import { ConfirmAction } from "../../../components/confirm-action";
import { TTrack, TTrackPublic } from "@pondfm/app-shared";
import { useStopPropagation } from "../../../hooks/use-stop-propagation";
import { stopPropagation } from "../../../utils/stop-propagation";
import { Link } from "react-router-dom";
import { ExternalLink } from "lucide-react";

const [UpdateTrackProvider, useUpdateTrackContext] = createProvider({
  contextName: "UpdateTrackContext",
  hook: ({ track }: { track: TTrackPublic }) => {
    return { track };
  },
});

export function UpdateTrackModal({ track }: { track: TTrackPublic }) {
  const { toggleState } = useToggleContext();
  return (
    <Modal title='Update Track' onClose={() => toggleState(false)}>
      <UpdateTrackProvider track={track}>
        <ModalContent />
      </UpdateTrackProvider>
    </Modal>
  );
}

function ModalContent() {
  const playbackService = usePlaybackContext();
  const { track } = useUpdateTrackContext();
  const [genre, setGenre] = useState(track?.genre);
  const [moods, setMoods] = useState(track?.moods || []);

  const { toggleState: toggleModalVisible } = useToggleContext();

  const { submit, loading: updateLoading } = useUpdateTrack({
    track: {
      id: track?.id,
      moods,
      genre,
    },
    onSuccess: () => {
      toggleModalVisible(false);
    },
  });

  const {
    deleteTrack,
    status: deleteStatus,
    loading: deleteLoading,
  } = useDeleteTrack({
    onSuccess: () => {
      toggleModalVisible(false);
    },
  });

  return (
    <Form onSubmit={submit}>
      <div className='flex gap-2'>
        <img src={track?.artwork} loading='lazy' className='w-16 h-16 rounded-md' />
        <div className='flex flex-col'>
          <h2 className='text-xl font-semibold'>Updating {track?.title}</h2>
          <Link
            to={`https://audius.co${track.permalink}/edit`}
            className='flex gap-1 items-center text-primary'
            target='_blank'
          >
            <span>Edit on Audius</span>
            <ExternalLink size='1rem' />
          </Link>
        </div>
      </div>
      <Form.Group label='Main Genre'>
        <div className='gap-1 flex w-full flex-wrap'>
          <GenreSelector
            onChange={(genre) => {
              setGenre(genre);
            }}
            defaultSelected={track?.genre}
          />
        </div>
      </Form.Group>
      <Form.Group label='Style (Max 3)'>
        <div className='flex gap-1 w-full flex-wrap'>
          <MoodSelector
            onChange={(moods) => {
              setMoods(moods);
            }}
            defaultSelected={track?.moods}
          />
        </div>
      </Form.Group>
      <div className='flex flex-col w-full gap-2'>
        <LoaderButton
          onClick={stopPropagation()}
          type='submit'
          variant='contained'
          loading={updateLoading}
          disabled={updateLoading}
          fullWidth
          shape='rounded'
          paddingEnabled
        >
          Update
        </LoaderButton>
        <ConfirmAction
          variant='danger'
          intentButton={
            <Button variant='text' color='danger'>
              Delete Track
            </Button>
          }
          confirmButton={
            <LoaderButton variant='text' loading={deleteLoading}>
              Delete Track
            </LoaderButton>
          }
          intentCancelButton={<Button variant='text'>Keep Track</Button>}
          onConfirm={async () => {
            if (playbackService.currentPlayback?.track.id === track.id) {
              //Stop playback before deleting to prevent errors
              playbackService.stopPlayback();
            }
            await deleteTrack(track);
          }}
        >
          <p>
            You are about to delete this track. Deleted tracks cannot be recovered. Are you
            absolutely sure?
          </p>
        </ConfirmAction>
      </div>
    </Form>
  );
}
