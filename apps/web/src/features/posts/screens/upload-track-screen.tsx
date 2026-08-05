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
import { ErrorMessage, SuccessMessage } from '../../../components/helper-message';
import { TrackModal } from '../components/track-modal';

export function UploadTrackScreen() {
  const navigate = useNavigate();
  return <TrackModal onClose={() => navigate(-1)} />
}


