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
      return { success: true, data: await res.json() };
    },
  });

  return (
    <Modal
      title='Upload'
      onClose={() => navigate(-1)}>
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
        <Form.Controls
          disabled={loading}
          loading={loading}
          onCancel={() => navigate(-1)}
          acceptText='Upload Track'
        />
      </Form>
    </Modal>
  );
}
