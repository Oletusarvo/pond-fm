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

type TrackModalProps = {
  track?: TTrack;
  onClose: () => void;
}

export function TrackModal({ track, onClose }: TrackModalProps) {
  const genreRef = useRef<string | null>(track?.genre);
  const moodsRef = useRef<string[]>(track?.moods || []);
  const { submit, loading, status } = useSubmit({
    fetchFn: async payload => {


      let res;
      if (!track) {
        payload.set('genre', genreRef.current);
        payload.set('moods', JSON.stringify(moodsRef.current));
        res = await apiService.createTrack(payload);
      }
      else {
        const data = Object.fromEntries(payload) as Record<string, any>;
        data.genre = genreRef.current;
        data.moods = moodsRef.current;
        res = await apiService.updateTrack(track.id, data);
      }

      if (!res.ok) {
        return { success: false };
      }
      return { success: true };
    },
  });

  return (
    <Modal
      title='Upload'
      onClose={onClose}>
      <div className='flex flex-col w-full gap-8'>
        <div className='flex flex-col w-full'>
          {
            !track ? <> <h2 className='font-semibold text-lg'>Upload Your Track</h2>
              <p className='text-slate-500'>The platform currently supports only mp3 and wav uploads.</p></> : <>
              <h2 className='font-semibold text-lg'>Edit Your Track</h2>

            </>
          }
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
          <Form.Controls
            disabled={loading}
            loading={loading}
            onCancel={onClose}
            acceptText={track ? 'Update Track' : 'Upload Track'}
          />
          {
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
    </Modal>
  )
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