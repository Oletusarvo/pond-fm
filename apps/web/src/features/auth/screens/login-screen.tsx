import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Button, LoaderButton } from '../../../components/button';
import { useAuthContext } from '../providers/auth-provider';
import { Input } from '../../../components/input';
import { Form } from '../../../components/form';
import { useStatus } from '../../../hooks/use-status';

export function LoginScreen() {
  const navigate = useNavigate();
  const close = () => navigate('/');
  const { requestAuthorization } = useAuthContext();
  const { status, loading, setStatus } = useStatus();

  const onSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    const credentials = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
      username?: string;
    };

    try {
      await requestAuthorization(credentials);
      setStatus('success');
      navigate('/');
    } catch (err) {
      console.log(err.message);
      setStatus('error');
    }
  };

  return (
    <Modal
      title='Login'
      onClose={close}>
      <Form onSubmit={onSubmit}>
        <Form.Group label='Username'>
          <Input
            name='username'
            placeholder='Enter your username...'
            required
          />
        </Form.Group>

        <Form.Group label='Email'>
          <Input
            name='email'
            placeholder='Enter your email...'
            type='email'
            required
          />
          <span className='text-slate-500 text-xs'>
            We will send you a link into your inbox through which to authenticate. The link is valid
            for 15 minutes.
          </span>
        </Form.Group>

        <div className='flex gap-2 w-full'>
          <Button
            disabled={status === 'success' || loading}
            type='button'
            onClick={close}
            fullWidth
            paddingEnabled
            variant='outlined'
            shape='rounded'>
            Cancel
          </Button>
          <LoaderButton
            disabled={loading || status === 'success'}
            loading={loading}
            type='submit'
            fullWidth
            paddingEnabled
            variant='contained'
            shape='rounded'>
            Login
          </LoaderButton>
        </div>
      </Form>
    </Modal>
  );
}
