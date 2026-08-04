import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Form } from '../../../components/form';
import { Input } from '../../../components/input';
import { useSubmit } from '../../../hooks/use-submit';
import { apiService } from '../../../utils/api-service';
import { TagList } from '../components/tag-list';
import { useRef, useState } from 'react';
import { genreMap } from '../../../utils/genre-map';
import { useGenreSelector } from '../hooks/use-genre-selector';
import { useMainGenres } from '../hooks/use-main-genres';
import { useMoods } from '../hooks/use-moods';
import { useToggleList } from '../../../hooks/use-toggle-list';

export function UploadTrackScreen() {
  const navigate = useNavigate();
  const genreRef = useRef<string | null>(null);
  const moodsRef = useRef<string[]>([]);
  const { submit, loading } = useSubmit({
    fetchFn: async payload => {
      payload.set('genre', genreRef.current);
      payload.set('moods', JSON.stringify(moodsRef.current));
      const res = await apiService.createTrack(payload);
      if (!res.ok) {
        return { success: false };
      }
      return { success: true };
    },
  });

  return (
    <Modal
      title='Upload'
      onClose={() => navigate(-1)}>
      <div className='flex flex-col w-full gap-8'>
        <div className='flex flex-col w-full'>
          <h2 className='font-semibold text-lg'>Upload Your Track</h2>
          <p className='text-slate-500'>The platform currently supports only mp3 and wav uploads.</p>
        </div>
        <Form onSubmit={submit}>
          <Form.Group label='Title'>
            <Input
              required
              type='text'
              name='title'
              placeholder='Type a title for the track...'
            />
          </Form.Group>
          <Form.Group label='File'>
            <Input
              required
              type='file'
              name='file'
            />
          </Form.Group>
          <Form.Group label='Main Genre'>
            <GenreSelector onChange={genre => genreRef.current = genre} />
          </Form.Group>
          <Form.Group label='Style (Max 3)'>
            <MoodSelector onChange={moods => moodsRef.current = moods} />
          </Form.Group>
          <Form.Controls
            disabled={loading}
            loading={loading}
            onCancel={() => navigate(-1)}
            acceptText='Upload Track'
          />
        </Form>
      </div>
    </Modal>
  );
}

function GenreSelector({ onChange }) {
  const [selectedGenre, setSelectedGenre] = useState(null);
  const { data: genres, isPending: genresPending } = useMainGenres();
  const onGenreSelected = (genre: string) => {
    setSelectedGenre(genre);
    onChange(genre)
  }
  return (
    <TagList selectedTags={[selectedGenre]} tags={genres || []} onTagSelected={onGenreSelected} />
  );
}

function MoodSelector({ onChange }) {
  const { items: selectedMoods, toggleItem: toggleMood } = useToggleList<string>({
    limit: 3,
    onChanged: (items) => onChange(items)
  });

  const { data: moods, isPending: moodsPending } = useMoods();

  return (
    <TagList tags={moods || []} selectedTags={selectedMoods} onTagSelected={tag => toggleMood(tag)} color="secondary" />
  )
}
