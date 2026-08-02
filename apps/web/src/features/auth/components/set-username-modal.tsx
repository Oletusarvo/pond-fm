import { useNavigate } from 'react-router-dom';
import { Form } from '../../../components/form';
import { Input } from '../../../components/input';
import { Modal } from '../../../components/modal';
import { useAuthContext } from '../providers/auth-provider';
import { useSubmit } from '../../../hooks/use-submit';
import { apiService } from '../../../utils/api-service';

export function SetUsernameModal() {
  const navigate = useNavigate();
  const authService = useAuthContext();
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
      title='Onboarding'
      onClose={() => null}>
      <div className='flex flex-col gap-4'>
        <div className='flex flex-col'>
          <h2 className='text-xl font-semibold'>Please choose a username</h2>
          <p className='text-slate-500'>First things first; choose yourself a username.</p>
        </div>
        <Form onSubmit={submit}>
          <Form.Group label='Username'>
            <Input
              name='username'
              required
            />
          </Form.Group>
          <Form.Controls
            loading={status === 'loading'}
            cancelText='Logout'
            acceptText='Confirm'
            onCancel={async () =>
              await authService.logout().then(res => {
                if (res.ok) {
                  navigate('/');
                }
              })
            }
          />
        </Form>
      </div>
    </Modal>
  );
}
