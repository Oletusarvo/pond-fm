import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Form } from '../../../components/form';
import { Input } from '../../../components/input';
import { useSubmit } from '../../../hooks/use-submit';
import { apiService } from '../../../utils/api-service';

export function UploadTrackScreen() {
  const navigate = useNavigate();
  const { submit, loading } = useSubmit({
    fetchFn: async payload => {
      console.log(payload);
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
          <p className='text-slate-500'>The platform currently supports only mp3 uploads.</p>
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
          <Form.Group label='Tags'>
            <Input
              required
              name='tags'
            />
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
