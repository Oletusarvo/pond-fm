import { useRef, useState } from "react";
import { Modal } from "../../../components/modal";
import { useToggleContext } from "../../../providers/toggle-provider";
import { Form } from "../../../components/form";
import { createProvider } from "../../../utils/create-provider";
import { GenreSelector, MoodSelector } from "./track-modal-selector";
import { Input } from "../../../components/input";
import { useDeleteTrack } from "../hooks/use-delete-track";
import { usePlaybackContext } from "../../audio/providers/playback-provider";
import { useUpdateTrack } from "../hooks/use-update-track";
import { ConfirmAction } from "../../../components/confirm-action";
import { TTrack, TTrackPublic } from "@pondfm/app-shared";
import { useStopPropagation } from "../../../hooks/use-stop-propagation";
import { stopPropagation } from "../../../utils/stop-propagation";
import { Link } from "react-router-dom";
import { ExternalLink, Save, Trash2 } from "lucide-react";
import { Spinner } from "../../../components/spinner";

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
      <div className='flex items-center gap-4 rounded-2xl border border-emerald-100 bg-linear-to-br from-emerald-50 via-white to-teal-50 p-4'>
        <img
          src={track?.artwork}
          alt=''
          loading='lazy'
          className='h-16 w-16 shrink-0 rounded-xl border border-white object-cover shadow-sm'
        />
        <div className='flex min-w-0 flex-col gap-1'>
          <h2 className='truncate text-lg font-bold text-slate-900'>Updating {track?.title}</h2>
          <Link
            to={`https://audius.co${track.permalink}/edit`}
            className='inline-flex w-fit items-center gap-1 rounded-lg px-2 py-1 text-sm font-semibold text-emerald-800 transition-colors hover:bg-emerald-100/70'
            target='_blank'
          >
            <span>Edit on Audius</span>
            <ExternalLink size='1rem' />
          </Link>
        </div>
      </div>
      <Form.Group label='Main Genre'>
        <div className='flex w-full flex-wrap gap-2'>
          <GenreSelector
            onChange={(genre) => {
              setGenre(genre);
            }}
            defaultSelected={track?.genre}
          />
        </div>
      </Form.Group>
      <Form.Group label='Style (Max 3)'>
        <div className='flex w-full flex-wrap gap-2'>
          <MoodSelector
            onChange={(moods) => {
              setMoods(moods);
            }}
            defaultSelected={track?.moods}
          />
        </div>
      </Form.Group>
      <div className='flex w-full flex-col gap-3 border-t border-slate-100 pt-4'>
        <button
          onClick={stopPropagation()}
          type='submit'
          disabled={updateLoading}
          className='inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60'
        >
          {updateLoading ? <Spinner /> : <Save className='h-4 w-4' />}
          {updateLoading ? "Updating..." : "Update"}
        </button>
        <ConfirmAction
          variant='danger'
          intentButton={
            <button
              type='button'
              className='inline-flex min-h-11 w-full text-nowrap flex-nowrap items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-5 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:scale-95'
            >
              <Trash2 className='h-4 w-4' />
              Delete Track
            </button>
          }
          confirmButton={
            <button
              type='button'
              disabled={deleteLoading || deleteStatus === "success"}
              className='inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60'
            >
              {deleteLoading ? <Spinner /> : <Trash2 className='h-4 w-4' />}
              {deleteLoading ? "Deleting..." : "Delete Track"}
            </button>
          }
          intentCancelButton={
            <button
              type='button'
              className='min-h-10 flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 active:scale-95'
            >
              Keep Track
            </button>
          }
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
