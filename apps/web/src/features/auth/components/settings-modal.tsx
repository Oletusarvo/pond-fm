import { useNavigate } from 'react-router-dom';
import { Form } from '../../../components/form';
import { Input } from '../../../components/input';
import { Modal } from '../../../components/modal';
import { useAuthContext } from '../providers/auth-provider';
import { useSubmit } from '../../../hooks/use-submit';
import { apiService } from '../../../utils/api-service';
import { useSettingsContext } from '../providers/settings-provider';

export function SettingsModal() {
  const navigate = useNavigate();
  const authService = useAuthContext();
  const settingsService = useSettingsContext();

  const { submit, status } = useSubmit({
    fetchFn: async payload => {
      const p = Object.fromEntries(payload) as { username: string };
      const res = await apiService.changeUsername(p.username);
      return {
        success: res.ok,
        data: p.username,
      };
    },
    onSuccess: async username => {
      await authService.refreshSession({
        user: {
          username,
        },
      });

    },
  });

  return (
    <Modal
      title='Settings'
      onClose={() => settingsService.toggleSettingsModal(false)}>
      <Form onSubmit={submit}>
        <Form.Group label='Username'>
          <Input
            defaultValue={authService.session?.user.username}
            name='username'
            required
          />
        </Form.Group>
        <Form.Controls
          loading={status === 'loading'}
          cancelText='Cancel'
          acceptText='Confirm'
          onCancel={() => settingsService.toggleSettingsModal(false)
          }
        />
      </Form>

    </Modal>
  );
}
