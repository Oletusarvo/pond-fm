import { useNavigate } from 'react-router-dom';
import { Form } from '../../../components/form';
import { Input } from '../../../components/input';
import { Modal } from '../../../components/modal';
import { useAuthContext } from '../providers/auth-provider';
import { useSubmit } from '../../../hooks/use-submit';
import { apiService } from '../../../utils/api-service';
import { useSettingsContext } from '../providers/settings-provider';
import { ErrorMessage, SuccessMessage } from '../../../components/helper-message';
import { useToggleContext } from '../../../providers/toggle-provider';

export function ProfileSettingsModal() {
  const { toggleState } = useToggleContext();
  const close = () => toggleState(false);
  return (
    <Modal
      title='Settings'
      onClose={close}>
      <ModalContent close={close} />
    </Modal>
  );
}

function ModalContent({ close }) {
  const authService = useAuthContext();

  const { submit, status } = useSubmit({
    fetchFn: async payload => {
      const p = Object.fromEntries(payload) as { username: string };
      const res = await apiService.updateUser(p);
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
        onCancel={close}
      />
      {status === 'error'
        ?
        <ErrorMessage>Something went wrong!</ErrorMessage>
        : status === 'success'
          ?
          <SuccessMessage>Profile updated</SuccessMessage>
          :
          null}
    </Form>
  )
}
