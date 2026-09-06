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
      ...track,
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
        <GenreSelector
          onChange={(genre) => {
            setGenre(genre);
          }}
          defaultSelected={track?.genre}
        />
      </Form.Group>
      <Form.Group label='Style (Max 3)'>
        <MoodSelector
          onChange={(moods) => {
            setMoods(moods);
          }}
          defaultSelected={track?.moods}
        />
      </Form.Group>
      <div className='flex flex-col w-full gap-2'>
        <LoaderButton
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
            You are about to delete this track. Deleted tracks cannot be
            recovered. Are you absolutely sure?
          </p>
        </ConfirmAction>
      </div>
    </Form>
  );
}
