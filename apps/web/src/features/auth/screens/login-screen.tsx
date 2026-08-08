import { useNavigate } from 'react-router-dom';
import { Modal } from '../../../components/modal';
import { Button, LoaderButton } from '../../../components/button';
import { Input } from '../../../components/input';
import { Form } from '../../../components/form';
import { useStatus } from '../../../hooks/use-status';
import { useAppContext } from '../../../providers/app-provider';
import { useAuthContext } from '../providers/auth-provider';

export function LoginScreen() {
  const navigate = useNavigate();
  const close = () => navigate('/');
  return (
    <Modal
      title='Login'
      onClose={close}>
      <ModalContent />
    </Modal>
  );
}

//Render the content separately to stop the modal from re-rendering when the states change.
function ModalContent() {

  const authService = useAuthContext();
  const { status, loading, setStatus } = useStatus();

  const onSubmit = async e => {
    e.preventDefault();
    setStatus('loading');
    const credentials = Object.fromEntries(new FormData(e.currentTarget)) as {
      email: string;
      username?: string;
    };

    try {
      await authService.requestAuthorization(credentials);
      setStatus('success');
    } catch (err) {
      console.log(err.message);
      setStatus('error');
    }
  };

  return (
    status !== 'success' ? (
      <Form onSubmit={onSubmit}>
        <Form.Group label='Email'>
          <Input
            name='email'
            placeholder='Enter your email...'
            type='email'
            required
          />
          <span className='text-slate-500 text-xs'>
            We will send you a link into your inbox through which to authenticate. The link is
            valid for 15 minutes.
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
    ) : (
      <div className='flex w-full items-center flex-col pb-4'>
        <h2 className='font-semibold text-xl mb-2'>Login link sent!</h2>
        <p className='text-slate-500 text-center'>
          Please check your email. We have sent you a link through which to complete your login
          process.
        </p>
      </div>
    )

  )
}
